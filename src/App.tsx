import { useState, useMemo } from 'react'
import { Header } from './components/Header'
import { Step1Contract } from './components/Step1Contract'
import { Step2Inventory } from './components/Step2Inventory'
import { Step3PurchaseOrder } from './components/Step3PurchaseOrder'
import { Step4BomViewer } from './components/Step4BomViewer'
import { INITIAL_CONTRACTS } from './data/bomData'
import type { ContractOrder, PurchaseOrder } from './types/scm'
import {
  calculateRequiredParts,
  generatePurchaseOrders
} from './utils/scmCalculations'

export default function App() {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1)

  // 1. 계약서 목록 및 선택 상태
  const [contracts, setContracts] = useState<ContractOrder[]>(INITIAL_CONTRACTS)
  const [selectedContractIds, setSelectedContractIds] = useState<string[]>(() =>
    INITIAL_CONTRACTS.map((c) => c.id)
  )

  // 2. 현재고 수량 수정값 상태 (partId -> stock)
  const [stockOverrides, setStockOverrides] = useState<Record<string, number>>({})
  const [includeSafetyStock, setIncludeSafetyStock] = useState<boolean>(true)

  // 3. 발주서 상태 맵 (orderId -> '발주대기' | '발주완료')
  const [orderStatusMap, setOrderStatusMap] = useState<Record<string, '발주대기' | '발주완료'>>({})

  // 선택된 계약서 목록
  const activeContracts = useMemo(
    () => contracts.filter((c) => selectedContractIds.includes(c.id)),
    [contracts, selectedContractIds]
  )

  // 계약서 참조명
  const contractRefTitle = useMemo(() => {
    if (activeContracts.length === 0) return '선택된 계약 없음'
    if (activeContracts.length === 1) return activeContracts[0].clientName
    return `${activeContracts[0].clientName} 외 ${activeContracts.length - 1}건`
  }, [activeContracts])

  // 2단계: 실시간 재고 및 소요량 계산
  const inventory = useMemo(() => {
    return calculateRequiredParts(activeContracts, includeSafetyStock, stockOverrides)
  }, [activeContracts, includeSafetyStock, stockOverrides])

  // 3단계: 거래처별 발주서 자동 생성
  const purchaseOrders = useMemo<PurchaseOrder[]>(() => {
    const rawOrders = generatePurchaseOrders(inventory, undefined, contractRefTitle)
    // 수동 상태 보존
    return rawOrders.map((o) => {
      const savedStatus = orderStatusMap[o.supplier.id] || o.status
      return {
        ...o,
        status: savedStatus
      }
    })
  }, [inventory, contractRefTitle, orderStatusMap])

  // 계약서 토글 핸들러
  const handleToggleContractSelect = (id: string) => {
    setSelectedContractIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // 신규 계약서 추가
  const handleAddContract = (newContract: ContractOrder) => {
    setContracts((prev) => [newContract, ...prev])
    setSelectedContractIds((prev) => [newContract.id, ...prev])
  }

  // 계약서 삭제
  const handleDeleteContract = (id: string) => {
    if (!confirm('이 계약서를 삭제하시겠습니까?')) return
    setContracts((prev) => prev.filter((c) => c.id !== id))
    setSelectedContractIds((prev) => prev.filter((item) => item !== id))
  }

  // 현재고 수정
  const handleUpdateStock = (partId: string, newStock: number) => {
    setStockOverrides((prev) => ({
      ...prev,
      [partId]: newStock
    }))
  }

  // 현재고 리셋
  const handleResetStock = () => {
    if (!confirm('현재고를 기본 초기값으로 리셋하시겠습니까?')) return
    setStockOverrides({})
  }

  // 발주 상태 토글
  const handleToggleOrderStatus = (orderId: string) => {
    const order = purchaseOrders.find((o) => o.id === orderId)
    if (!order) return
    const nextStatus = order.status === '발주대기' ? '발주완료' : '발주대기'
    setOrderStatusMap((prev) => ({
      ...prev,
      [order.supplier.id]: nextStatus
    }))
  }

  // 전체 발주완료 처리
  const handleMarkAllCompleted = () => {
    const updated: Record<string, '발주대기' | '발주완료'> = {}
    purchaseOrders.forEach((o) => {
      updated[o.supplier.id] = '발주완료'
    })
    setOrderStatusMap(updated)
  }

  // 통계 수치
  const shortageCount = inventory.filter((i) => i.shortageQty > 0).length
  const pendingOrdersCount = purchaseOrders.filter((o) => o.status === '발주대기').length

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Global Header */}
      <Header
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        contractCount={contracts.length}
        shortageCount={shortageCount}
        pendingOrderCount={pendingOrdersCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeStep === 1 && (
          <Step1Contract
            contracts={contracts}
            selectedContractIds={selectedContractIds}
            onToggleContractSelect={handleToggleContractSelect}
            onAddContract={handleAddContract}
            onDeleteContract={handleDeleteContract}
            onProceedToStep2={() => setActiveStep(2)}
          />
        )}

        {activeStep === 2 && (
          <Step2Inventory
            inventory={inventory}
            includeSafetyStock={includeSafetyStock}
            setIncludeSafetyStock={setIncludeSafetyStock}
            onUpdateStock={handleUpdateStock}
            onResetStock={handleResetStock}
            onProceedToStep3={() => setActiveStep(3)}
          />
        )}

        {activeStep === 3 && (
          <Step3PurchaseOrder
            orders={purchaseOrders}
            onToggleOrderStatus={handleToggleOrderStatus}
            onMarkAllCompleted={handleMarkAllCompleted}
            onBackToStep2={() => setActiveStep(2)}
          />
        )}

        {activeStep === 4 && <Step4BomViewer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>한국타피(주) SCM 무인민원발급기 자동 발주 관리 시스템</span>
          <span>기준 문서: 무인민원발급기_부자재목록 (TAPI-9270J/9270T/9320J/9320T)</span>
        </div>
      </footer>
    </div>
  )
}
