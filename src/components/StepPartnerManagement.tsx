import React, { useState } from 'react'
import {
  Users,
  Building,
  Truck,
  Plus,
  Search,
  Download,
  Phone,
  Mail,
  MapPin,
  Clock,
  Edit2,
  Trash2,
  X,
  CreditCard
} from 'lucide-react'
import type { ClientPartner, Supplier } from '../types/scm'
import { exportClientsToExcel, exportSuppliersToExcel } from '../utils/scmCalculations'

interface StepPartnerManagementProps {
  clients: ClientPartner[]
  suppliers: Supplier[]
  onAddClient: (client: ClientPartner) => void
  onUpdateClient: (client: ClientPartner) => void
  onDeleteClient: (id: string) => void
  onAddSupplier: (supplier: Supplier) => void
  onUpdateSupplier: (supplier: Supplier) => void
  onDeleteSupplier: (id: string) => void
  onSelectClientForContract?: (client: ClientPartner) => void
}

type TabType = 'ALL' | 'CLIENT' | 'SUPPLIER'

export const StepPartnerManagement: React.FC<StepPartnerManagementProps> = ({
  clients,
  suppliers,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT'>('ADD')
  const [modalPartnerType, setModalPartnerType] = useState<'CLIENT' | 'SUPPLIER'>('CLIENT')

  // Form State
  const [editId, setEditId] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [businessNo, setBusinessNo] = useState('')
  const [ceo, setCeo] = useState('')
  const [category, setCategory] = useState('')
  const [department, setDepartment] = useState('')
  const [manager, setManager] = useState('')
  const [contact, setContact] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [leadTimeDays, setLeadTimeDays] = useState(5)
  const [note, setNote] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('익월 말 현금결제')
  const [bankInfo, setBankInfo] = useState('')

  // Open Modal for Add
  const handleOpenAddModal = (type: 'CLIENT' | 'SUPPLIER' = 'CLIENT') => {
    setModalMode('ADD')
    setModalPartnerType(type)
    setEditId(`PTR-${Date.now()}`)
    setCode(type === 'CLIENT' ? `CLI-${String(clients.length + 1).padStart(3, '0')}` : `SUP-${String(suppliers.length + 1).padStart(2, '0')}`)
    setName('')
    setBusinessNo('')
    setCeo('')
    setCategory(type === 'CLIENT' ? '지자체' : '디스플레이/부품')
    setDepartment('')
    setManager('')
    setContact('')
    setEmail('')
    setAddress('')
    setLeadTimeDays(5)
    setNote('')
    setPaymentTerms('익월 말 현금결제')
    setBankInfo('')
    setIsModalOpen(true)
  }

  // Open Modal for Edit
  const handleOpenEditClient = (c: ClientPartner) => {
    setModalMode('EDIT')
    setModalPartnerType('CLIENT')
    setEditId(c.id)
    setCode(c.code)
    setName(c.name)
    setBusinessNo(c.businessNo)
    setCeo(c.ceo)
    setCategory(c.category)
    setDepartment(c.department || '')
    setManager(c.manager)
    setContact(c.contact)
    setEmail(c.email)
    setAddress(c.address)
    setNote(c.note || '')
    setIsModalOpen(true)
  }

  const handleOpenEditSupplier = (s: Supplier) => {
    setModalMode('EDIT')
    setModalPartnerType('SUPPLIER')
    setEditId(s.id)
    setCode(s.code || s.id)
    setName(s.name)
    setBusinessNo(s.businessNo)
    setCeo(s.ceo)
    setCategory(s.category)
    setManager(s.manager || '')
    setContact(s.contact)
    setEmail(s.email)
    setAddress(s.address || '')
    setLeadTimeDays(s.leadTimeDays || 5)
    setPaymentTerms(s.paymentTerms || '익월 말 현금결제')
    setBankInfo(s.bankInfo || '')
    setNote(s.note || '')
    setIsModalOpen(true)
  }

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('거래처명을 입력해주세요.')
      return
    }

    if (modalPartnerType === 'CLIENT') {
      const clientData: ClientPartner = {
        id: editId,
        partnerType: 'CLIENT',
        code: code.trim(),
        name: name.trim(),
        businessNo: businessNo.trim() || '123-83-00000',
        ceo: ceo.trim() || '대표자 미지정',
        category: (category as any) || '지자체',
        department: department.trim(),
        manager: manager.trim() || '담당자',
        contact: contact.trim() || '-',
        email: email.trim() || '-',
        address: address.trim() || '-',
        note: note.trim()
      }

      if (modalMode === 'ADD') {
        onAddClient(clientData)
      } else {
        onUpdateClient(clientData)
      }
    } else {
      const supplierData: Supplier = {
        id: editId,
        partnerType: 'SUPPLIER',
        code: code.trim(),
        name: name.trim(),
        businessNo: businessNo.trim() || '123-81-00000',
        ceo: ceo.trim() || '대표자',
        category: category.trim() || '부품공급',
        leadTimeDays: Number(leadTimeDays) || 5,
        manager: manager.trim(),
        contact: contact.trim() || '-',
        email: email.trim() || '-',
        address: address.trim(),
        paymentTerms: paymentTerms.trim(),
        bankInfo: bankInfo.trim(),
        note: note.trim()
      }

      if (modalMode === 'ADD') {
        onAddSupplier(supplierData)
      } else {
        onUpdateSupplier(supplierData)
      }
    }

    setIsModalOpen(false)
  }

  // Filtered lists
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contact.includes(searchTerm)
    const matchesCat = categoryFilter === 'ALL' || c.category === categoryFilter
    return matchesSearch && matchesCat
  })

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.code || s.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contact.includes(searchTerm)
    const matchesCat = categoryFilter === 'ALL' || s.category === categoryFilter
    return matchesSearch && matchesCat
  })

  // Statistics
  const totalClients = clients.length
  const totalSuppliers = suppliers.length
  const avgLeadTime = Math.round(
    suppliers.reduce((sum, s) => sum + s.leadTimeDays, 0) / (suppliers.length || 1)
  )

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Clients */}
        <div
          onClick={() => setActiveTab('CLIENT')}
          className={`bg-white border rounded-2xl p-5 shadow-xs flex items-center gap-4 cursor-pointer transition ${
            activeTab === 'CLIENT' ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <p className="text-xs font-semibold text-slate-500">매출거래처 (고객사/발주처)</p>
            </div>
            <h4 className="text-2xl font-extrabold text-blue-700 mt-0.5">
              {totalClients} <span className="text-sm font-semibold text-slate-500">개사</span>
            </h4>
          </div>
        </div>

        {/* Total Suppliers */}
        <div
          onClick={() => setActiveTab('SUPPLIER')}
          className={`bg-white border rounded-2xl p-5 shadow-xs flex items-center gap-4 cursor-pointer transition ${
            activeTab === 'SUPPLIER' ? 'border-amber-600 ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <p className="text-xs font-semibold text-slate-500">매입거래처 (부품공급 협력사)</p>
            </div>
            <h4 className="text-2xl font-extrabold text-amber-700 mt-0.5">
              {totalSuppliers} <span className="text-sm font-semibold text-slate-500">개사</span>
            </h4>
          </div>
        </div>

        {/* Average Lead Time */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">부품 평균 조달 리드타임</p>
            <h4 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {avgLeadTime} <span className="text-sm font-semibold text-slate-500">일</span>
            </h4>
          </div>
        </div>

        {/* Total Managed */}
        <div
          onClick={() => setActiveTab('ALL')}
          className={`bg-white border rounded-2xl p-5 shadow-xs flex items-center gap-4 cursor-pointer transition ${
            activeTab === 'ALL' ? 'border-slate-800 ring-2 ring-slate-800/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">총 관리 거래처 합계</p>
            <h4 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {totalClients + totalSuppliers} <span className="text-sm font-semibold text-slate-500">개사</span>
            </h4>
          </div>
        </div>
      </div>

      {/* Control Bar: Subtabs, Search, Buttons */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Subtab Segmented Control */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => {
                setActiveTab('ALL')
                setCategoryFilter('ALL')
              }}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              전체 거래처 ({totalClients + totalSuppliers})
            </button>
            <button
              onClick={() => {
                setActiveTab('CLIENT')
                setCategoryFilter('ALL')
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'CLIENT'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-blue-700 hover:bg-blue-50'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>매출거래처 ({totalClients})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('SUPPLIER')
                setCategoryFilter('ALL')
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'SUPPLIER'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>매입거래처 ({totalSuppliers})</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Excel Download Button */}
            <button
              onClick={() => {
                if (activeTab === 'SUPPLIER') {
                  exportSuppliersToExcel(suppliers)
                } else if (activeTab === 'CLIENT') {
                  exportClientsToExcel(clients)
                } else {
                  exportClientsToExcel(clients)
                  setTimeout(() => exportSuppliersToExcel(suppliers), 300)
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>거래처 대장 엑셀 다운로드</span>
            </button>

            {/* Add Partner Buttons */}
            <div className="inline-flex rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={() => handleOpenAddModal(activeTab === 'SUPPLIER' ? 'SUPPLIER' : 'CLIENT')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {activeTab === 'SUPPLIER' ? '신규 매입처 등록' : '신규 매출처 등록'}
                </span>
              </button>
              {activeTab === 'ALL' && (
                <button
                  onClick={() => handleOpenAddModal('SUPPLIER')}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition border-l border-white/20 cursor-pointer"
                  title="신규 매입거래처(협력사) 등록"
                >
                  + 매입처
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="거래처명, 코드, 대표자, 담당자, 전화번호 검색..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* Partners Cards / Tables */}
      <div className="space-y-6">
        {/* Section 1: 매출거래처 (Sales Clients) */}
        {(activeTab === 'ALL' || activeTab === 'CLIENT') && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-blue-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-600 text-white">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    매출거래처 (고객사 / 지자체 및 발주처)
                  </h3>
                  <p className="text-xs text-slate-500">
                    1단계 계약서 접수 시 발주처로 지정되며, 무인민원발급기가 납품되는 공공기관 및 고객사입니다.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {filteredClients.length}개사
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-4">고객사 코드</th>
                    <th className="py-3 px-4">고객사 (기관명)</th>
                    <th className="py-3 px-4">사업자번호</th>
                    <th className="py-3 px-4">대표자/기관장</th>
                    <th className="py-3 px-4">구분</th>
                    <th className="py-3 px-4">담당부서/담당자</th>
                    <th className="py-3 px-4">연락처/이메일</th>
                    <th className="py-3 px-4">납품장소/주소</th>
                    <th className="py-3 px-4 text-center">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        등록된 매출거래처가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((c) => (
                      <tr key={c.id} className="hover:bg-blue-50/20 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                          {c.code}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900 whitespace-nowrap">
                          {c.name}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                          {c.businessNo}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                          {c.ceo}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                            {c.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-800 whitespace-nowrap">
                          <span className="text-slate-500 text-xs mr-1">{c.department}</span>
                          <strong>{c.manager}</strong>
                        </td>
                        <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                          <div className="flex items-center gap-1 text-slate-700 font-mono">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {c.contact}
                          </div>
                          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                            <Mail className="w-3 h-3 text-slate-300" />
                            {c.email}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-500 max-w-xs truncate" title={c.address}>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{c.address}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenEditClient(c)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                              title="수정"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`'${c.name}' 거래처를 삭제하시겠습니까?`)) {
                                  onDeleteClient(c.id)
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 2: 매입거래처 (Suppliers) */}
        {(activeTab === 'ALL' || activeTab === 'SUPPLIER') && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-amber-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-600 text-white">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    매입거래처 (원자재/부품 공급 협력업체)
                  </h3>
                  <p className="text-xs text-slate-500">
                    무인민원발급기 22개 부자재를 공급하는 공식 협력사이며, 3단계에서 자동 발주서가 생성되는 공급처입니다.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                {filteredSuppliers.length}개사
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-4">업체코드</th>
                    <th className="py-3 px-4">협력사명</th>
                    <th className="py-3 px-4">사업자번호</th>
                    <th className="py-3 px-4">대표자</th>
                    <th className="py-3 px-4">공급 부품 카테고리</th>
                    <th className="py-3 px-4 text-center">조달 리드타임</th>
                    <th className="py-3 px-4">연락처 / 이메일</th>
                    <th className="py-3 px-4">결제조건 / 비고</th>
                    <th className="py-3 px-4 text-center">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSuppliers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        등록된 매입거래처가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredSuppliers.map((s) => (
                      <tr key={s.id} className="hover:bg-amber-50/20 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-800 whitespace-nowrap">
                          {s.code || s.id}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900 whitespace-nowrap">
                          {s.name}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                          {s.businessNo}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                          {s.ceo}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                            {s.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap font-bold text-blue-700">
                          {s.leadTimeDays}일
                        </td>
                        <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                          <div className="flex items-center gap-1 text-slate-700 font-mono">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {s.contact}
                          </div>
                          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                            <Mail className="w-3 h-3 text-slate-300" />
                            {s.email}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-slate-700">
                            <CreditCard className="w-3 h-3 text-slate-400" />
                            <span>{s.paymentTerms || '익월 말 현금'}</span>
                          </div>
                          {s.note && <p className="text-[11px] text-slate-400 mt-0.5">{s.note}</p>}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenEditSupplier(s)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                              title="수정"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`'${s.name}' 거래처를 삭제하시겠습니까?`)) {
                                  onDeleteSupplier(s.id)
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Partner Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-lg text-white ${
                    modalPartnerType === 'CLIENT' ? 'bg-blue-600' : 'bg-amber-600'
                  }`}
                >
                  {modalPartnerType === 'CLIENT' ? (
                    <Building className="w-5 h-5" />
                  ) : (
                    <Truck className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {modalMode === 'ADD' ? '신규 거래처 등록' : '거래처 정보 수정'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {modalPartnerType === 'CLIENT'
                      ? '매출거래처 (고객사/발주기관)'
                      : '매입거래처 (부품공급 협력사)'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="mt-5 space-y-4">
              {/* Type Switcher (only in ADD mode) */}
              {modalMode === 'ADD' && (
                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setModalPartnerType('CLIENT')
                      setCategory('지자체')
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                      modalPartnerType === 'CLIENT'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🏢 매출거래처 (고객사)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setModalPartnerType('SUPPLIER')
                      setCategory('디스플레이/부품')
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                      modalPartnerType === 'SUPPLIER'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🏭 매입거래처 (협력사)
                  </button>
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    거래처 코드
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    거래처명 (상호/기관명) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예: 서울특별시 종로구청"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    사업자등록번호
                  </label>
                  <input
                    type="text"
                    value={businessNo}
                    onChange={(e) => setBusinessNo(e.target.value)}
                    placeholder="123-81-12345"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    대표자명 / 기관장
                  </label>
                  <input
                    type="text"
                    value={ceo}
                    onChange={(e) => setCeo(e.target.value)}
                    placeholder="대표자 성명"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    카테고리 / 구분
                  </label>
                  {modalPartnerType === 'CLIENT' ? (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="지자체">지자체 (시·군·구청)</option>
                      <option value="공공기관">공공기관</option>
                      <option value="공기업">공기업</option>
                      <option value="금융기관">금융기관</option>
                      <option value="일반기업">일반기업</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="예: 디스플레이, 터치패널, PC"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>

                {modalPartnerType === 'CLIENT' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      담당 부서
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="예: 민원봉사과, 자치행정과"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      표준 조달 리드타임 (일)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={leadTimeDays}
                      onChange={(e) => setLeadTimeDays(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    담당자 성명
                  </label>
                  <input
                    type="text"
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    placeholder="홍길동"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    연락처 / 전화번호
                  </label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="02-1234-5678"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    이메일 주소
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@company.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    사업장 주소 / 기본 납품처
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="사업장 도로명 주소"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {modalPartnerType === 'SUPPLIER' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        결제 조건
                      </label>
                      <input
                        type="text"
                        value={paymentTerms}
                        onChange={(e) => setPaymentTerms(e.target.value)}
                        placeholder="예: 익월 말 현금, 세금계산서 청구 후 30일"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        입금 계좌 정보
                      </label>
                      <input
                        type="text"
                        value={bankInfo}
                        onChange={(e) => setBankInfo(e.target.value)}
                        placeholder="예: 기업은행 123-456-78901 (주)협력사"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    특이사항 / 메모
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="거래처 관련 참고사항 입력"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-white text-xs font-bold shadow-md transition cursor-pointer ${
                    modalPartnerType === 'CLIENT'
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                      : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                  }`}
                >
                  {modalMode === 'ADD' ? '거래처 등록 완료' : '수정사항 저장'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
