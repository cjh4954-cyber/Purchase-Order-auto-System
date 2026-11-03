import React, { useState } from 'react'
import {
  Truck,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  Building2,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet
} from 'lucide-react'
import type { PurchaseOrder } from '../types/scm'
import { exportPurchaseOrderToExcel } from '../utils/scmCalculations'
import { OrderPrintModal } from './OrderPrintModal'

interface Step3PurchaseOrderProps {
  orders: PurchaseOrder[]
  onToggleOrderStatus: (orderId: string) => void
  onMarkAllCompleted: () => void
  onBackToStep2: () => void
}

export const Step3PurchaseOrder: React.FC<Step3PurchaseOrderProps> = ({
  orders,
  onToggleOrderStatus,
  onMarkAllCompleted,
  onBackToStep2
}) => {
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<PurchaseOrder | null>(null)
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // 전체 통계
  const totalSuppliers = orders.length
  const totalItemsCount = orders.reduce((sum, o) => sum + o.items.length, 0)
  const grandTotalAmount = orders.reduce((sum, o) => sum + o.grandTotal, 0)
  const completedOrdersCount = orders.filter((o) => o.status === '발주완료').length

  const handleDownloadAllExcel = () => {
    orders.forEach((o, idx) => {
      setTimeout(() => {
        exportPurchaseOrderToExcel(o)
      }, idx * 300)
    })
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Suppliers Count */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">발주 대상 협력업체</p>
            <h4 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {totalSuppliers} <span className="text-sm font-semibold text-slate-500">개사</span>
            </h4>
          </div>
        </div>

        {/* Total Items */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">발주 품목 총계</p>
            <h4 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {totalItemsCount} <span className="text-sm font-semibold text-slate-500">건</span>
            </h4>
          </div>
        </div>

        {/* Grand Total */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="font-mono text-xl font-black">₩</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">총 발주금액 (VAT 포함)</p>
            <h4 className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-0.5 truncate">
              {grandTotalAmount.toLocaleString('ko-KR')} <span className="text-xs font-semibold text-slate-500">원</span>
            </h4>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              completedOrdersCount === totalSuppliers && totalSuppliers > 0
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-amber-50 text-amber-600'
            }`}
          >
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">발주 완료 진행율</p>
            <h4 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {completedOrdersCount} / {totalSuppliers}{' '}
              <span className="text-xs font-semibold text-slate-500">
                ({totalSuppliers > 0 ? Math.round((completedOrdersCount / totalSuppliers) * 100) : 0}%)
              </span>
            </h4>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            협력사별 자동 생성 발주서 ({orders.length}개사)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            2단계에서 파악된 부족 자재가 공급 거래처별로 자동 분류되어 개별 발주서로 작성되었습니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onBackToStep2}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
          >
            재고 현황으로 돌아가기
          </button>

          {orders.length > 0 && (
            <>
              <button
                onClick={onMarkAllCompleted}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                전체 발주완료 처리
              </button>

              <button
                onClick={handleDownloadAllExcel}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                전체 발주서 엑셀 일괄 다운로드
              </button>
            </>
          )}
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center space-y-3 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-extrabold text-slate-900">
            발주가 필요한 부족 자재가 없습니다!
          </h4>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            현재 등록된 계약서의 모든 소요 자재가 현재고로 충분히 충당 가능합니다.
            계약 수량을 추가하거나 현재고를 조정하여 발주서를 생성해보세요.
          </p>
          <button
            onClick={onBackToStep2}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 transition cursor-pointer"
          >
            현재고 파악 (2단계) 확인하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((po) => {
            const isExpanded = expandedOrders[po.id] !== false // Default open
            const isCompleted = po.status === '발주완료'

            return (
              <div
                key={po.id}
                className={`bg-white border rounded-2xl shadow-xs overflow-hidden transition ${
                  isCompleted ? 'border-slate-200 opacity-90' : 'border-blue-200'
                }`}
              >
                {/* Order Card Header */}
                <div className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        {po.orderNo}
                      </span>
                      <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-slate-500" />
                        {po.supplier.name}
                      </h4>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded">
                        {po.supplier.category}
                      </span>
                      <button
                        onClick={() => onToggleOrderStatus(po.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold transition cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {po.status} (클릭 시 변경)
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span><strong>사업자:</strong> {po.supplier.businessNo}</span>
                      <span><strong>대표:</strong> {po.supplier.ceo}</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {po.supplier.contact}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {po.supplier.email}
                      </span>
                      <span className="text-blue-600 font-bold">
                        납기: 약 {po.supplier.leadTimeDays}일 소요
                      </span>
                    </div>
                  </div>

                  {/* Header Actions & Amount */}
                  <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <div className="text-right mr-2">
                      <span className="text-[11px] text-slate-400 block">발주 합계 (VAT포함)</span>
                      <span className="font-mono text-lg font-extrabold text-slate-900">
                        {po.grandTotal.toLocaleString('ko-KR')} 원
                      </span>
                    </div>

                    {/* Print Preview Button */}
                    <button
                      onClick={() => setSelectedOrderForPrint(po)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                      title="공식 발주서 서식 미리보기 및 인쇄"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>서식 미리보기</span>
                    </button>

                    {/* Excel Download Button */}
                    <button
                      onClick={() => exportPurchaseOrderToExcel(po)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                      title="엑셀 발주서 다운로드"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>엑셀 발주서</span>
                    </button>

                    {/* Collapse / Expand */}
                    <button
                      onClick={() => toggleExpand(po.id)}
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Items Table (Collapsible) */}
                {isExpanded && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-bold">
                          <th className="py-2.5 px-4 w-12">No.</th>
                          <th className="py-2.5 px-4">발주 품목명</th>
                          <th className="py-2.5 px-4">규격 및 모델 사양</th>
                          <th className="py-2.5 px-3 text-right">발주수량</th>
                          <th className="py-2.5 px-3 text-center">단위</th>
                          <th className="py-2.5 px-4 text-right">단가 (원)</th>
                          <th className="py-2.5 px-4 text-right">공급가액 (원)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {po.items.map((it, idx) => (
                          <tr key={it.partId} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-4 font-mono text-slate-400">{idx + 1}</td>
                            <td className="py-2.5 px-4 font-bold text-slate-900">{it.partName}</td>
                            <td className="py-2.5 px-4 text-slate-600">{it.spec}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-black text-rose-600 text-sm">
                              {it.qty}
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-500">{it.unit}</td>
                            <td className="py-2.5 px-4 text-right font-mono text-slate-600">
                              {it.unitPrice.toLocaleString('ko-KR')}
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                              {it.amount.toLocaleString('ko-KR')} 원
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-50/70 border-t border-slate-200 text-xs">
                          <td colSpan={5} className="py-2.5 px-4 text-right font-bold text-slate-600">
                            공급가액: {po.totalAmount.toLocaleString('ko-KR')} 원 | 부가세(10%):{' '}
                            {po.taxAmount.toLocaleString('ko-KR')} 원
                          </td>
                          <td colSpan={2} className="py-2.5 px-4 text-right font-bold text-slate-900">
                            총 합계:{' '}
                            <span className="font-mono text-blue-700 font-extrabold text-sm">
                              {po.grandTotal.toLocaleString('ko-KR')} 원
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal for Print */}
      <OrderPrintModal
        order={selectedOrderForPrint}
        onClose={() => setSelectedOrderForPrint(null)}
      />
    </div>
  )
}
