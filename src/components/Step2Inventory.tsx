import React, { useState } from 'react'
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Download,
  RotateCcw,
  ArrowRight,
  TrendingDown,
  Coins,
  ShieldAlert,
  Edit2
} from 'lucide-react'
import type { InventoryItem } from '../types/scm'
import { exportInventoryToExcel } from '../utils/scmCalculations'

interface Step2InventoryProps {
  inventory: InventoryItem[]
  includeSafetyStock: boolean
  setIncludeSafetyStock: (val: boolean) => void
  onUpdateStock: (partId: string, newStock: number) => void
  onResetStock: () => void
  onProceedToStep3: () => void
}

export const Step2Inventory: React.FC<Step2InventoryProps> = ({
  inventory,
  includeSafetyStock,
  setIncludeSafetyStock,
  onUpdateStock,
  onResetStock,
  onProceedToStep3
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SHORTAGE' | 'SAFE_SHORTAGE' | 'NORMAL'>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [editingPartId, setEditingPartId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number>(0)

  // 고유 카테고리 목록
  const categories = Array.from(new Set(inventory.map((i) => i.category)))

  // 필터링 적용
  const filteredItems = inventory.filter((item) => {
    // 텍스트 검색
    const matchesSearch =
      item.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.spec.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(searchTerm.toLowerCase())

    // 상태 필터
    let matchesStatus = true
    if (statusFilter === 'SHORTAGE') {
      matchesStatus = item.status === '부족'
    } else if (statusFilter === 'SAFE_SHORTAGE') {
      matchesStatus = item.status === '안전재고부족' || item.status === '부족'
    } else if (statusFilter === 'NORMAL') {
      matchesStatus = item.status === '정상'
    }

    // 카테고리 필터
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  // 통계 계산
  const totalParts = inventory.length
  const shortageCount = inventory.filter((i) => i.shortageQty > 0).length
  const totalShortageCost = inventory.reduce((sum, i) => sum + i.shortageQty * i.unitPrice, 0)
  const totalRequiredQty = inventory.reduce((sum, i) => sum + i.requiredQty, 0)

  const handleStartEdit = (item: InventoryItem) => {
    setEditingPartId(item.partId)
    setEditValue(item.currentStock)
  }

  const handleSaveEdit = (partId: string) => {
    onUpdateStock(partId, Math.max(0, editValue))
    setEditingPartId(null)
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Parts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">총 관리 부자재 품목</p>
            <h4 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {totalParts} <span className="text-sm font-semibold text-slate-500">종류</span>
            </h4>
          </div>
        </div>

        {/* Total Required */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">계약 총 소요 부품수</p>
            <h4 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {totalRequiredQty} <span className="text-sm font-semibold text-slate-500">개</span>
            </h4>
          </div>
        </div>

        {/* Shortage Count */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              shortageCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {shortageCount > 0 ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">발주 필요 (재고부족) 품목</p>
            <h4
              className={`text-2xl font-extrabold mt-0.5 ${
                shortageCount > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {shortageCount} <span className="text-sm font-semibold text-slate-500">품목</span>
            </h4>
          </div>
        </div>

        {/* Estimated Order Cost */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">부족분 발주 예상금액</p>
            <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5 truncate">
              {totalShortageCost.toLocaleString('ko-KR')} <span className="text-xs font-semibold text-slate-500">원</span>
            </h4>
          </div>
        </div>
      </div>

      {/* Control / Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="부품명, 규격사양, 거래처명 검색..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Safety Stock Checkbox */}
            <label className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-200 transition">
              <input
                type="checkbox"
                checked={includeSafetyStock}
                onChange={(e) => setIncludeSafetyStock(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span>안전재고 확보 포함 발주</span>
            </label>

            {/* Reset Stock Button */}
            <button
              onClick={onResetStock}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
              title="초기 샘플 현재고 수치로 리셋"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>재고 리셋</span>
            </button>

            {/* Export Excel Button */}
            <button
              onClick={() => exportInventoryToExcel(inventory)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>재고현황 엑셀 다운로드</span>
            </button>

            {/* Move to Step 3 CTA */}
            <button
              onClick={onProceedToStep3}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <span>3단계: 거래처 발주서 생성</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            상태:
          </span>
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            전체 ({inventory.length})
          </button>
          <button
            onClick={() => setStatusFilter('SHORTAGE')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'SHORTAGE'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            재고부족만 ({inventory.filter((i) => i.status === '부족').length})
          </button>
          <button
            onClick={() => setStatusFilter('SAFE_SHORTAGE')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'SAFE_SHORTAGE'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            발주대상 전체 ({inventory.filter((i) => i.shortageQty > 0).length})
          </button>
          <button
            onClick={() => setStatusFilter('NORMAL')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'NORMAL'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            재고충분 ({inventory.filter((i) => i.status === '정상').length})
          </button>

          <span className="text-slate-300 mx-2">|</span>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
            <span>카테고리:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 border-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">전체 카테고리</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3.5 px-4">No.</th>
                <th className="py-3.5 px-4">부품명</th>
                <th className="py-3.5 px-4">규격 및 모델 사양</th>
                <th className="py-3.5 px-4">지정 거래처</th>
                <th className="py-3.5 px-3 text-right">소요량</th>
                <th className="py-3.5 px-3 text-right">현재고</th>
                <th className="py-3.5 px-3 text-right">안전재고</th>
                <th className="py-3.5 px-3 text-right text-rose-600 font-extrabold">과부족</th>
                <th className="py-3.5 px-4 text-center">상태</th>
                <th className="py-3.5 px-4 text-right">단가 (원)</th>
                <th className="py-3.5 px-4 text-right">발주예상액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    검색 조건에 일치하는 부자재 항목이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const isEditing = editingPartId === item.partId
                  const isShortage = item.shortageQty > 0
                  const orderCost = item.shortageQty * item.unitPrice

                  return (
                    <tr
                      key={item.partId}
                      className={`transition ${
                        isShortage
                          ? 'bg-rose-50/20 hover:bg-rose-50/40'
                          : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono text-slate-400">{idx + 1}</td>

                      {/* Part Name */}
                      <td className="py-3.5 px-4 font-extrabold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{item.partName}</span>
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {item.category}
                          </span>
                        </div>
                      </td>

                      {/* Spec */}
                      <td className="py-3.5 px-4 text-slate-600 text-xs max-w-xs truncate" title={item.spec}>
                        {item.spec}
                      </td>

                      {/* Supplier */}
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap text-xs font-medium">
                        {item.supplierName}
                      </td>

                      {/* Required Qty */}
                      <td className="py-3.5 px-3 text-right font-bold text-blue-700">
                        {item.requiredQty} {item.unit}
                      </td>

                      {/* Current Stock (Editable) */}
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        {isEditing ? (
                          <div className="inline-flex items-center gap-1 justify-end">
                            <input
                              type="number"
                              min={0}
                              value={editValue}
                              onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                              className="w-16 px-1.5 py-0.5 text-right font-mono text-sm border-2 border-blue-600 rounded bg-white focus:outline-hidden"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEdit(item.partId)}
                              className="px-2 py-0.5 bg-blue-600 text-white rounded text-xs font-bold"
                            >
                              저장
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="group inline-flex items-center gap-1 font-mono font-bold text-slate-800 hover:text-blue-600 hover:bg-blue-50 px-2 py-0.5 rounded cursor-pointer transition"
                            title="클릭하여 현재고 수량 수정"
                          >
                            <span>{item.currentStock} {item.unit}</span>
                            <Edit2 className="w-3 h-3 text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition" />
                          </button>
                        )}
                      </td>

                      {/* Safety Stock */}
                      <td className="py-3.5 px-3 text-right text-slate-500 font-mono">
                        {item.safetyStock} {item.unit}
                      </td>

                      {/* Shortage Qty */}
                      <td className="py-3.5 px-3 text-right font-mono font-black">
                        {item.shortageQty > 0 ? (
                          <span className="text-rose-600 font-bold bg-rose-100 px-2 py-0.5 rounded">
                            -{item.shortageQty} {item.unit}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">0</span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {item.status === '부족' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-700">
                            <AlertTriangle className="w-3 h-3" />
                            재고부족
                          </span>
                        ) : item.status === '안전재고부족' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                            <ShieldAlert className="w-3 h-3" />
                            안전재고부족
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            적정
                          </span>
                        )}
                      </td>

                      {/* Unit Price */}
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                        {item.unitPrice.toLocaleString('ko-KR')}
                      </td>

                      {/* Expected Order Amount */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        {orderCost > 0 ? (
                          <span className="text-rose-700">{orderCost.toLocaleString('ko-KR')} 원</span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
