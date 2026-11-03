export type ModelCode = 'TAPI-9270J' | 'TAPI-9270T' | 'TAPI-9320J' | 'TAPI-9320T'

export interface ModelInfo {
  code: ModelCode
  name: string
  identifier: string // 물품식별번호
  dimensions: string // 규격치수
  displaySize: string
  touchType: string
  isBarrierFree: boolean // 점자/음성유도기 포함 여부 (J 모델)
  description: string
}

export interface BomPart {
  no: number
  name: string
  spec: string
  qty: number
  note?: string
}

// 거래처 구분: 매출거래처(고객사/발주처) vs 매입거래처(부품공급사/협력사)
export type PartnerType = 'CLIENT' | 'SUPPLIER'

// 매출거래처 (Sales Client / 고객사)
export interface ClientPartner {
  id: string
  partnerType: 'CLIENT'
  code: string
  name: string
  businessNo: string
  ceo: string
  category: '지자체' | '공공기관' | '공기업' | '금융기관' | '일반기업'
  manager: string
  department?: string
  contact: string
  email: string
  address: string
  note?: string
}

// 매입거래처 (Supplier / 협력사)
export interface Supplier {
  id: string
  partnerType?: 'SUPPLIER'
  code?: string
  name: string
  businessNo: string
  ceo: string
  contact: string
  email: string
  category: string
  leadTimeDays: number
  manager?: string
  address?: string
  bankInfo?: string
  paymentTerms?: string
  supplyItems?: string[]
  note?: string
}

export type BusinessPartner = (ClientPartner & { leadTimeDays?: never }) | (Supplier & { partnerType: 'SUPPLIER' })

export interface MasterPart {
  id: string
  name: string
  spec: string
  category: string
  defaultSupplierId: string
  unitPrice: number
  unit: string
  safetyStock: number
}

export interface ContractOrder {
  id: string
  contractNo: string
  clientName: string
  clientId?: string
  orderDate: string
  dueDate: string
  manager: string
  managerContact: string
  memo?: string
  modelQuantities: Record<ModelCode, number>
  status: '접수완료' | '자재검토중' | '발주완료'
}

export interface InventoryItem {
  partId: string
  partName: string
  spec: string
  category: string
  supplierId: string
  supplierName: string
  unitPrice: number
  unit: string
  currentStock: number // 현재고
  safetyStock: number // 안전재고
  requiredQty: number // 소요량
  shortageQty: number // 부족량 (required + safety - current)
  status: '정상' | '부족' | '안전재고부족'
}

export interface PurchaseOrderItem {
  partId: string
  partName: string
  spec: string
  qty: number
  unit: string
  unitPrice: number
  amount: number
}

export interface PurchaseOrder {
  id: string
  orderNo: string
  orderDate: string
  supplier: Supplier
  items: PurchaseOrderItem[]
  totalAmount: number
  taxAmount: number
  grandTotal: number
  contractRef: string
  status: '발주대기' | '발주완료'
}
