import React from 'react'
import { Printer, X, Download } from 'lucide-react'
import type { PurchaseOrder } from '../types/scm'
import { exportPurchaseOrderToExcel } from '../utils/scmCalculations'

interface OrderPrintModalProps {
  order: PurchaseOrder | null
  onClose: () => void
}

export const OrderPrintModal: React.FC<OrderPrintModalProps> = ({ order, onClose }) => {
  if (!order) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Action Bar (Hidden in print) */}
        <div className="print:hidden p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base">공식 물품 발주서 미리보기 & 출력</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportPurchaseOrderToExcel(order)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              엑셀 다운로드
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              인쇄 (PDF 저장)
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 overflow-y-auto print:p-0 print:overflow-visible text-slate-900 bg-white">
          {/* Document Header */}
          <div className="text-center pb-8 border-b-2 border-slate-900">
            <h1 className="text-3xl sm:text-4xl font-black tracking-widest text-slate-900">
              물 품 발 주 서
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-2">
              PURCHASE ORDER — DOCUMENT NO: {order.orderNo}
            </p>
          </div>

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between text-xs py-3 text-slate-600 border-b border-slate-300">
            <span><strong>발주일자:</strong> {order.orderDate}</span>
            <span><strong>계약참조:</strong> {order.contractRef}</span>
            <span><strong>납품기한:</strong> 발주일로부터 {order.supplier.leadTimeDays}일 이내</span>
          </div>

          {/* Supplier & Purchaser Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-xs">
            {/* 공급받는자 (한국타피) */}
            <div className="border border-slate-400 rounded-lg overflow-hidden">
              <div className="bg-slate-100 py-1.5 px-3 font-bold border-b border-slate-400 text-slate-800 text-center">
                공 급 받 는 자 (발주처)
              </div>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <th className="py-2 px-3 bg-slate-50 font-semibold w-24 border-r border-slate-200 text-slate-600">
                      회사명
                    </th>
                    <td className="py-2 px-3 font-bold text-slate-900">한국타피(주)</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-2 px-3 bg-slate-50 font-semibold border-r border-slate-200 text-slate-600">
                      사업자번호
                    </th>
                    <td className="py-2 px-3 font-mono">123-81-45678</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-2 px-3 bg-slate-50 font-semibold border-r border-slate-200 text-slate-600">
                      대표자
                    </th>
                    <td className="py-2 px-3 flex items-center justify-between">
                      <span>대표이사</span>
                      <span className="w-10 h-10 rounded-full border-2 border-red-500 text-red-500 text-[10px] flex items-center justify-center font-bold rotate-[-12deg]">
                        (직인생략)
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-2 px-3 bg-slate-50 font-semibold border-r border-slate-200 text-slate-600">
                      담당 / 연락처
                    </th>
                    <td className="py-2 px-3">SCM 자재관리팀 / 02-1234-5678</td>
                  </tr>
                  <tr>
                    <th className="py-2 px-3 bg-slate-50 font-semibold border-r border-slate-200 text-slate-600">
                      사업장 주소
                    </th>
                    <td className="py-2 px-3">서울특별시 금천구 가산디지털1로 타피빌딩</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 공급자 (협력업체) */}
            <div className="border border-slate-400 rounded-lg overflow-hidden">
              <div className="bg-slate-100 py-1.5 px-3 font-bold border-b border-slate-400 text-slate-800 text-center">
                공 급 자 (협력사)
              </div>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <th className="py-2 px-3 bg-slate-50 font-semibold w-24 border-r border-slate-200 text-slate-600">
                      상호(회사명)
                    </th>
                    <td className="py-2 px-3 font-bold text-blue-900">{order.supplier.name}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-2 px-3 bg-slate-50 font-semibold border-r border-slate-200 text-slate-600">
                      사업자번호
                    </th>
                    <td className="py-2 px-3 font-mono">{order.supplier.businessNo}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-2 px-3 bg-slate-50 font-semibold border-r border-slate-200 text-slate-600">
                      대표자
                    </th>
                    <td className="py-2 px-3">{order.supplier.ceo} 귀하</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-2 px-3 bg-slate-50 font-semibold border-r border-slate-200 text-slate-600">
                      전화번호
                    </th>
                    <td className="py-2 px-3 font-mono">{order.supplier.contact}</td>
                  </tr>
                  <tr>
                    <th className="py-2 px-3 bg-slate-50 font-semibold border-r border-slate-200 text-slate-600">
                      수신 이메일
                    </th>
                    <td className="py-2 px-3 font-mono">{order.supplier.email}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Amount Highlight */}
          <div className="bg-slate-100 p-4 rounded-xl border border-slate-300 flex items-center justify-between my-4 text-sm font-bold">
            <span>발주 총 합계금액 (VAT 포함):</span>
            <span className="text-xl font-extrabold text-blue-800 font-mono">
              일금 {order.grandTotal.toLocaleString('ko-KR')}원정 (₩{order.grandTotal.toLocaleString('ko-KR')})
            </span>
          </div>

          {/* Items Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden my-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                  <th className="py-2.5 px-3 text-center w-12 border-r border-slate-200">No.</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">품목명</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">규격 및 모델 사양</th>
                  <th className="py-2.5 px-2 text-center w-16 border-r border-slate-200">수량</th>
                  <th className="py-2.5 px-2 text-center w-14 border-r border-slate-200">단위</th>
                  <th className="py-2.5 px-3 text-right w-24 border-r border-slate-200">단가 (원)</th>
                  <th className="py-2.5 px-3 text-right w-28">공급가액 (원)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items.map((it, idx) => (
                  <tr key={it.partId}>
                    <td className="py-2 px-3 text-center font-mono text-slate-500 border-r border-slate-200">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-3 font-bold text-slate-900 border-r border-slate-200">
                      {it.partName}
                    </td>
                    <td className="py-2 px-3 text-slate-600 border-r border-slate-200">
                      {it.spec}
                    </td>
                    <td className="py-2 px-2 text-center font-bold text-blue-700 border-r border-slate-200">
                      {it.qty}
                    </td>
                    <td className="py-2 px-2 text-center text-slate-500 border-r border-slate-200">
                      {it.unit}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-600 border-r border-slate-200">
                      {it.unitPrice.toLocaleString('ko-KR')}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                      {it.amount.toLocaleString('ko-KR')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-bold border-t border-slate-300">
                  <td colSpan={5} className="py-2 px-3 text-right border-r border-slate-200">
                    공급가액 합계:
                  </td>
                  <td colSpan={2} className="py-2 px-3 text-right font-mono text-slate-900">
                    {order.totalAmount.toLocaleString('ko-KR')} 원
                  </td>
                </tr>
                <tr className="bg-slate-50 font-bold border-t border-slate-200">
                  <td colSpan={5} className="py-2 px-3 text-right border-r border-slate-200">
                    부가가치세 (VAT 10%):
                  </td>
                  <td colSpan={2} className="py-2 px-3 text-right font-mono text-slate-900">
                    {order.taxAmount.toLocaleString('ko-KR')} 원
                  </td>
                </tr>
                <tr className="bg-blue-50/70 font-extrabold border-t-2 border-slate-400 text-blue-950">
                  <td colSpan={5} className="py-2.5 px-3 text-right border-r border-slate-200 text-sm">
                    총 발주금액 (합계):
                  </td>
                  <td colSpan={2} className="py-2.5 px-3 text-right font-mono text-base text-blue-800">
                    {order.grandTotal.toLocaleString('ko-KR')} 원
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer Terms */}
          <div className="mt-8 text-xs text-slate-600 space-y-1 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="font-bold text-slate-800">[ 발주 준수 사항 ]</p>
            <p>1. 상기 기재된 품목 및 규격 사양을 철저히 준수하여 정해진 납기일 이내에 납품하여 주시기 바랍니다.</p>
            <p>2. 검수 불합격 또는 불량품 발생 시 즉시 무상 교환 조치하여야 합니다.</p>
            <p>3. 납품 시 본 발주서 사본 및 거래명세서를 동봉하여 주시기 바랍니다.</p>
          </div>

          <div className="text-center mt-8 pt-4 border-t border-slate-300 text-xs font-bold text-slate-500">
            한국타피 주식회사 대표이사 (인)
          </div>
        </div>
      </div>
    </div>
  )
}
