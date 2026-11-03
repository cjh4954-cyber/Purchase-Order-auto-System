import * as XLSX from 'xlsx'
import { MODEL_BOM, MASTER_PARTS, INITIAL_SUPPLIERS } from '../data/bomData'
import type {
  ContractOrder,
  InventoryItem,
  PurchaseOrder,
  PurchaseOrderItem,
  Supplier,
  ClientPartner
} from '../types/scm'

/**
 * 선택된 계약서(또는 활성 계약서들)를 기반으로 소요 자재 총합(MRP) 계산
 */
export function calculateRequiredParts(
  contracts: ContractOrder[],
  includeSafetyStock: boolean = true,
  currentStockOverrides: Record<string, number> = {}
): InventoryItem[] {
  // 1. 부품별 총 소요량 집계 (Key: partName + '::' + spec)
  const requiredMap = new Map<string, number>()

  // 모든 마스터 파트에 대해 0으로 초기화
  MASTER_PARTS.forEach((part) => {
    const key = `${part.name}::${part.spec}`
    requiredMap.set(key, 0)
  })

  // 각 계약서의 모델별 수량을 BOM과 곱해서 합산
  contracts.forEach((contract) => {
    Object.entries(contract.modelQuantities).forEach(([mCode, qty]) => {
      if (qty <= 0) return
      const bomList = MODEL_BOM[mCode as keyof typeof MODEL_BOM] || []
      bomList.forEach((bomItem) => {
        const key = `${bomItem.name}::${bomItem.spec}`
        const currentReq = requiredMap.get(key) ?? 0
        requiredMap.set(key, currentReq + bomItem.qty * qty)
      })
    })
  })

  // 2. InventoryItem 리스트 생성
  return MASTER_PARTS.map((part) => {
    const key = `${part.name}::${part.spec}`
    const requiredQty = requiredMap.get(key) ?? 0
    const currentStock = currentStockOverrides[part.id] !== undefined
      ? currentStockOverrides[part.id]
      : part.initialStock

    const supplier = INITIAL_SUPPLIERS.find((s) => s.id === part.defaultSupplierId)

    // 부족 수량 계산
    // 안전재고 포함 여부에 따라 계산
    const targetStock = includeSafetyStock ? requiredQty + part.safetyStock : requiredQty
    const shortageQty = Math.max(0, targetStock - currentStock)

    let status: '정상' | '부족' | '안전재고부족' = '정상'
    if (currentStock < requiredQty) {
      status = '부족'
    } else if (currentStock < requiredQty + part.safetyStock) {
      status = '안전재고부족'
    }

    return {
      partId: part.id,
      partName: part.name,
      spec: part.spec,
      category: part.category,
      supplierId: part.defaultSupplierId,
      supplierName: supplier?.name ?? '미지정',
      unitPrice: part.unitPrice,
      unit: part.unit,
      currentStock,
      safetyStock: part.safetyStock,
      requiredQty,
      shortageQty,
      status
    }
  })
}

/**
 * 부족 재고 목록을 기반으로 거래처별 발주서 목록 자동 생성
 */
export function generatePurchaseOrders(
  inventory: InventoryItem[],
  suppliers: Supplier[] = INITIAL_SUPPLIERS,
  contractRef: string = '계약 소요량 합산'
): PurchaseOrder[] {
  // 부족 수량이 있는 품목만 필터링
  const shortageItems = inventory.filter((item) => item.shortageQty > 0)

  // 거래처별 그룹핑
  const grouped = new Map<string, InventoryItem[]>()
  shortageItems.forEach((item) => {
    const list = grouped.get(item.supplierId) || []
    list.push(item)
    grouped.set(item.supplierId, list)
  })

  const todayStr = new Date().toISOString().slice(0, 10)
  const orders: PurchaseOrder[] = []

  let orderSeq = 1
  grouped.forEach((items, supplierId) => {
    const supplier = suppliers.find((s) => s.id === supplierId) || {
      id: supplierId,
      name: '미지정 거래처',
      businessNo: '-',
      ceo: '-',
      contact: '-',
      email: '-',
      category: '일반',
      leadTimeDays: 7
    }

    const orderItems: PurchaseOrderItem[] = items.map((it) => {
      const amount = it.shortageQty * it.unitPrice
      return {
        partId: it.partId,
        partName: it.partName,
        spec: it.spec,
        qty: it.shortageQty,
        unit: it.unit,
        unitPrice: it.unitPrice,
        amount
      }
    })

    const totalAmount = orderItems.reduce((sum, it) => sum + it.amount, 0)
    const taxAmount = Math.round(totalAmount * 0.1) // 부가세 10%
    const grandTotal = totalAmount + taxAmount

    const orderNo = `PO-${todayStr.replace(/-/g, '')}-${String(orderSeq).padStart(3, '0')}`
    orderSeq++

    orders.push({
      id: `ORDER-${supplierId}-${Date.now()}`,
      orderNo,
      orderDate: todayStr,
      supplier,
      items: orderItems,
      totalAmount,
      taxAmount,
      grandTotal,
      contractRef,
      status: '발주대기'
    })
  })

  return orders
}

/**
 * 발주서 엑셀 다운로드 (SheetJS 활용)
 */
export function exportPurchaseOrderToExcel(po: PurchaseOrder) {
  const wb = XLSX.utils.book_new()

  // 1. 헤더 및 공급자/공급받는자 정보
  const headerData = [
    ['물 품 발 주 서 (Purchase Order)'],
    [''],
    ['발주번호', po.orderNo, '', '발주일자', po.orderDate],
    ['계약참조', po.contractRef, '', '납품기한', '발주일로부터 ' + po.supplier.leadTimeDays + '일 이내'],
    [''],
    ['[ 공급받는 자 (발주처) ]', '', '', '[ 공급자 (협력업체) ]', ''],
    ['회사명', '한국타피(주)', '', '회사명', po.supplier.name],
    ['사업자등록번호', '123-81-45678', '', '사업자등록번호', po.supplier.businessNo],
    ['대표자', '대표이사', '', '대표자', po.supplier.ceo],
    ['담당/연락처', '자재관리팀 / 02-1234-5678', '', '연락처', po.supplier.contact],
    ['이메일', 'scm@tapi.co.kr', '', '이메일', po.supplier.email],
    [''],
    ['No.', '품목명', '규격 및 사양', '수량', '단위', '단가 (원)', '공급가액 (원)']
  ]

  // 2. 품목 행 추가
  const itemRows = po.items.map((it, idx) => [
    idx + 1,
    it.partName,
    it.spec,
    it.qty,
    it.unit,
    it.unitPrice.toLocaleString('ko-KR'),
    it.amount.toLocaleString('ko-KR')
  ])

  // 3. 합계 행
  const totalRows = [
    [''],
    ['', '', '', '', '공급가액 합계', '', po.totalAmount.toLocaleString('ko-KR') + ' 원'],
    ['', '', '', '', '부가세 (10%)', '', po.taxAmount.toLocaleString('ko-KR') + ' 원'],
    ['', '', '', '', '총 발주금액 (VAT포함)', '', po.grandTotal.toLocaleString('ko-KR') + ' 원'],
    [''],
    ['비고', '상기 품목을 정히 발주하오니 납기일정을 준수하여 납품하여 주시기 바랍니다.']
  ]

  const fullData = [...headerData, ...itemRows, ...totalRows]
  const ws = XLSX.utils.aoa_to_sheet(fullData)

  // 열 너비 설정
  ws['!cols'] = [
    { wch: 6 },
    { wch: 22 },
    { wch: 45 },
    { wch: 8 },
    { wch: 8 },
    { wch: 15 },
    { wch: 18 }
  ]

  XLSX.utils.book_append_sheet(wb, ws, '발주서')
  XLSX.writeFile(wb, `발주서_${po.supplier.name}_${po.orderNo}.xlsx`)
}

/**
 * 전체 재고현황 엑셀 다운로드
 */
export function exportInventoryToExcel(inventory: InventoryItem[]) {
  const wb = XLSX.utils.book_new()
  const data = [
    ['한국타피(주) 무인민원발급기 부자재 재고 및 소요량 현황표'],
    ['출력일시: ' + new Date().toLocaleString('ko-KR')],
    [''],
    ['품목코드', '부품명', '규격 및 사양', '카테고리', '지정거래처', '단가(원)', '현재고', '안전재고', '계약소요량', '과부족수량', '상태']
  ]

  inventory.forEach((item) => {
    data.push([
      item.partId,
      item.partName,
      item.spec,
      item.category,
      item.supplierName,
      item.unitPrice.toLocaleString('ko-KR'),
      String(item.currentStock),
      String(item.safetyStock),
      String(item.requiredQty),
      String(item.shortageQty),
      item.status
    ])
  })

  const ws = XLSX.utils.aoa_to_sheet(data)
  ws['!cols'] = [
    { wch: 12 },
    { wch: 20 },
    { wch: 45 },
    { wch: 15 },
    { wch: 22 },
    { wch: 12 },
    { wch: 10 },
    { wch: 10 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 }
  ]

  XLSX.utils.book_append_sheet(wb, ws, '재고현황')
  XLSX.writeFile(wb, `무인민원발급기_부자재_재고현황_${new Date().toISOString().slice(0, 10)}.xlsx`)
}

/**
 * 매출거래처(고객사) 목록 엑셀 다운로드
 */
export function exportClientsToExcel(clients: ClientPartner[]) {
  const wb = XLSX.utils.book_new()
  const data = [
    ['한국타피(주) 매출거래처 (고객사/발주처) 관리대장'],
    ['출력일시: ' + new Date().toLocaleString('ko-KR')],
    [''],
    ['거래처코드', '고객사(기관명)', '사업자번호', '대표자', '구분', '부서', '담당자', '연락처', '이메일', '사업장/납품주소', '비고']
  ]

  clients.forEach((c) => {
    data.push([
      c.code,
      c.name,
      c.businessNo,
      c.ceo,
      c.category,
      c.department || '',
      c.manager,
      c.contact,
      c.email,
      c.address,
      c.note || ''
    ])
  })

  const ws = XLSX.utils.aoa_to_sheet(data)
  ws['!cols'] = [
    { wch: 14 },
    { wch: 25 },
    { wch: 16 },
    { wch: 14 },
    { wch: 12 },
    { wch: 18 },
    { wch: 14 },
    { wch: 16 },
    { wch: 25 },
    { wch: 45 },
    { wch: 30 }
  ]

  XLSX.utils.book_append_sheet(wb, ws, '매출거래처')
  XLSX.writeFile(wb, `매출거래처_관리대장_${new Date().toISOString().slice(0, 10)}.xlsx`)
}

/**
 * 매입거래처(협력사) 목록 엑셀 다운로드
 */
export function exportSuppliersToExcel(suppliers: Supplier[]) {
  const wb = XLSX.utils.book_new()
  const data = [
    ['한국타피(주) 매입거래처 (원자재/부품 공급 협력사) 관리대장'],
    ['출력일시: ' + new Date().toLocaleString('ko-KR')],
    [''],
    ['업체코드', '협력사명', '사업자번호', '대표자', '품목카테고리', '표준리드타임', '담당자', '전화번호', '이메일', '사업장주소', '결제조건/은행']
  ]

  suppliers.forEach((s) => {
    data.push([
      s.code || s.id,
      s.name,
      s.businessNo,
      s.ceo,
      s.category,
      `${s.leadTimeDays}일`,
      s.manager || '담당자',
      s.contact,
      s.email,
      s.address || '-',
      s.paymentTerms || '익월 말 현금'
    ])
  })

  const ws = XLSX.utils.aoa_to_sheet(data)
  ws['!cols'] = [
    { wch: 12 },
    { wch: 28 },
    { wch: 16 },
    { wch: 14 },
    { wch: 20 },
    { wch: 12 },
    { wch: 14 },
    { wch: 16 },
    { wch: 25 },
    { wch: 35 },
    { wch: 20 }
  ]

  XLSX.utils.book_append_sheet(wb, ws, '매입거래처')
  XLSX.writeFile(wb, `매입거래처_관리대장_${new Date().toISOString().slice(0, 10)}.xlsx`)
}

