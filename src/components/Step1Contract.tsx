import React, { useState } from 'react'
import {
  Plus,
  Trash2,
  Calendar,
  User,
  FileCheck2,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import type { ContractOrder, ModelCode, ClientPartner } from '../types/scm'
import { MODELS_INFO } from '../data/bomData'

interface Step1ContractProps {
  contracts: ContractOrder[]
  selectedContractIds: string[]
  clients?: ClientPartner[]
  onToggleContractSelect: (id: string) => void
  onAddContract: (newContract: ContractOrder) => void
  onDeleteContract: (id: string) => void
  onProceedToStep2: () => void
}

export const Step1Contract: React.FC<Step1ContractProps> = ({
  contracts,
  selectedContractIds,
  clients = [],
  onToggleContractSelect,
  onAddContract,
  onDeleteContract,
  onProceedToStep2
}) => {
  const [showAddForm, setShowAddForm] = useState(false)

  // 신규 등록 폼 State
  const [clientName, setClientName] = useState('')
  const [contractNo, setContractNo] = useState(() => `CT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`)
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 20)
    return d.toISOString().slice(0, 10)
  })
  const [manager, setManager] = useState('')
  const [managerContact, setManagerContact] = useState('')
  const [memo, setMemo] = useState('')

  const [quantities, setQuantities] = useState<Record<ModelCode, number>>({
    'TAPI-9270J': 1,
    'TAPI-9270T': 0,
    'TAPI-9320J': 1,
    'TAPI-9320T': 0
  })

  const handleSelectClient = (clientId: string) => {
    if (!clientId) return
    const selected = clients.find((c) => c.id === clientId)
    if (selected) {
      setClientName(selected.name)
      setManager(selected.manager)
      setManagerContact(selected.contact)
      setMemo(`납품처: ${selected.address} (${selected.department || ''})`)
    }
  }

  const updateQuantity = (code: ModelCode, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [code]: Math.max(0, (prev[code] || 0) + delta)
    }))
  }

  const totalMachinesInForm = Object.values(quantities).reduce((a, b) => a + b, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientName.trim()) {
      alert('고객사(발주처) 명을 입력해 주세요.')
      return
    }
    if (totalMachinesInForm <= 0) {
      alert('최소 1대 이상의 모델 수량을 입력해 주세요.')
      return
    }

    const newContract: ContractOrder = {
      id: `CNT-${Date.now()}`,
      contractNo: contractNo.trim(),
      clientName: clientName.trim(),
      orderDate: new Date().toISOString().slice(0, 10),
      dueDate,
      manager: manager.trim() || '담당자 미지정',
      managerContact: managerContact.trim() || '-',
      memo: memo.trim(),
      modelQuantities: { ...quantities },
      status: '접수완료'
    }

    onAddContract(newContract)
    setShowAddForm(false)
    // 폼 초기화
    setClientName('')
    setContractNo(`CT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`)
    setManager('')
    setManagerContact('')
    setMemo('')
    setQuantities({
      'TAPI-9270J': 1,
      'TAPI-9270T': 0,
      'TAPI-9320J': 0,
      'TAPI-9320T': 0
    })
  }

  // 선택된 계약서들의 총 발주 대수 집계
  const selectedContracts = contracts.filter((c) => selectedContractIds.includes(c.id))
  const totalSelectedMachines = selectedContracts.reduce((sum, c) => {
    return sum + Object.values(c.modelQuantities).reduce((a, b) => a + b, 0)
  }, 0)

  return (
    <div className="space-y-8">
      {/* Top Banner / Explanation */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-blue-900/10 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            1단계: 공공기관 및 지자체 계약서 접수
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            무인민원발급기 계약서 접수 & 자재 소요량(BOM) 자동 전개
          </h2>
          <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
            납품할 모델(TAPI-9270J, 9270T, 9320J, 9320T)과 수량을 등록하면, 한국타피(주) 표준 규격서에 따라 22종 부자재의 총 필요 수량이 실시간으로 자동 산출됩니다.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-800 font-bold text-sm shadow-md hover:bg-blue-50 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              신규 계약서 접수 등록
            </button>
            {contracts.length > 0 && (
              <button
                onClick={onProceedToStep2}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/30 hover:bg-blue-500/40 text-white font-semibold text-sm backdrop-blur-xs border border-white/20 transition cursor-pointer"
              >
                <span>현재고 파악(2단계) 바로가기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-12 -bottom-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Modal / Inline Add Form */}
      {showAddForm && (
        <div className="bg-white border-2 border-blue-500/40 rounded-2xl p-6 sm:p-8 shadow-xl transition-all">
          <div className="flex items-center justify-between pb-5 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                신규 계약서 접수서 작성
              </h3>
            </div>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600 text-sm font-semibold cursor-pointer"
            >
              취소
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* 등록된 매출거래처 빠른 선택 */}
            {clients.length > 0 && (
              <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5 shrink-0">
                  🏢 등록된 매출거래처(고객사)에서 정보 불러오기:
                </span>
                <select
                  onChange={(e) => handleSelectClient(e.target.value)}
                  defaultValue=""
                  className="px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">-- 직접 입력 또는 고객사 선택 --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.category}] {c.name} ({c.manager} / {c.contact})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 기본 계약 정보 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  고객사 (발주처 지자체/기관명) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="예: 서울특별시 송파구청 민원여권과"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  계약 번호 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contractNo}
                  onChange={(e) => setContractNo(e.target.value)}
                  placeholder="예: CT-2026-095"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  납품 기한 (납기일자) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  고객사 담당자
                </label>
                <input
                  type="text"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  placeholder="예: 홍길동 주무관"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  담당자 연락처
                </label>
                <input
                  type="text"
                  value={managerContact}
                  onChange={(e) => setManagerContact(e.target.value)}
                  placeholder="예: 02-2147-2000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  계약 비고 / 특이사항
                </label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="예: 1층 종합민원실 우선 설치"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* 모델별 수량 선택 카드 그리드 */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  계약 모델 및 대수 지정
                </h4>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                  선택 총 대수: {totalMachinesInForm}대
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {MODELS_INFO.map((model) => {
                  const qty = quantities[model.code] || 0
                  return (
                    <div
                      key={model.code}
                      className={`border rounded-xl p-4 transition-all ${
                        qty > 0
                          ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                              model.isBarrierFree
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {model.isBarrierFree ? '장애인편의(점자/음성)' : '일반/겸용'}
                          </span>
                          <h5 className="font-extrabold text-slate-900 text-base mt-1">
                            {model.code}
                          </h5>
                          <span className="text-[11px] text-slate-500">
                            식별번호: {model.identifier}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-slate-600 space-y-0.5">
                        <p>🖥️ {model.displaySize}</p>
                        <p>👆 {model.touchType}</p>
                        <p className="text-[11px] text-slate-400">📏 {model.dimensions}</p>
                      </div>

                      {/* Stepper Button */}
                      <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">발주 수량</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(model.code, -1)}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer text-base"
                          >
                            -
                          </button>
                          <span className="w-9 text-center font-extrabold text-base text-slate-900">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(model.code, 1)}
                            className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 flex items-center justify-center cursor-pointer text-base"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition cursor-pointer"
              >
                닫기
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-600/30 transition cursor-pointer"
              >
                계약서 접수 등록 완료
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contracts List Section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-blue-600" />
              접수된 계약서 목록 ({contracts.length}건)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              아래 목록에서 체크된 계약서의 수량을 기준으로 2단계 재고 파악 및 3단계 발주서가 자동 계산됩니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600">
              선택된 계약: <strong className="text-blue-600">{selectedContractIds.length}</strong>건 (총 <strong className="text-blue-600">{totalSelectedMachines}</strong>대)
            </span>
            <button
              onClick={onProceedToStep2}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
            >
              <span>현재고 분석(2단계) 이동</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {contracts.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <FileCheck2 className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600">등록된 계약서가 없습니다.</p>
            <p className="text-xs">상단의 [신규 계약서 접수 등록] 버튼을 눌러 계약서를 추가해 주세요.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {contracts.map((c) => {
              const isSelected = selectedContractIds.includes(c.id)
              const totalQty = Object.values(c.modelQuantities).reduce((a, b) => a + b, 0)

              return (
                <div
                  key={c.id}
                  className={`p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition ${
                    isSelected ? 'bg-blue-50/20' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleContractSelect(c.id)}
                      className="mt-1.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                          {c.contractNo}
                        </span>
                        <h4 className="font-bold text-slate-900 text-base">
                          {c.clientName}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          {c.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          접수일: {c.orderDate} / <strong>납기: {c.dueDate}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          담당: {c.manager} ({c.managerContact})
                        </span>
                      </div>

                      {c.memo && (
                        <p className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md inline-block">
                          📌 {c.memo}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Model breakdown pill */}
                  <div className="flex flex-wrap items-center gap-3 lg:justify-end pl-8 lg:pl-0">
                    <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-2 text-xs">
                      {Object.entries(c.modelQuantities).map(([code, qty]) => {
                        if (qty === 0) return null
                        return (
                          <div
                            key={code}
                            className="px-2 py-1 bg-white rounded-lg border border-slate-200 font-medium text-slate-700"
                          >
                            <span className="text-slate-500 mr-1">{code}:</span>
                            <strong className="text-blue-600 font-bold">{qty}대</strong>
                          </div>
                        )
                      })}
                      <div className="px-2 py-1 bg-blue-600 text-white rounded-lg font-bold">
                        총 {totalQty}대
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteContract(c.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="계약서 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
