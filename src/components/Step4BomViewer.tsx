import React, { useState } from 'react'
import { BookOpen, Check, Layers, AlertCircle } from 'lucide-react'
import { MODELS_INFO, MODEL_BOM } from '../data/bomData'
import type { ModelCode } from '../types/scm'

export const Step4BomViewer: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<ModelCode>('TAPI-9270J')

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-slate-900">
            한국타피(주) 무인민원발급기 표준 규격서 3.1항 부자재(BOM) 명세
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          엑셀 파일(<code>무인민원발급기_부자재목록.xlsx</code>)에 등록된 4대 표준 모델의 규격치수, 물품식별번호 및 부품 소요량 명세표입니다.
        </p>

        {/* Highlight Note */}
        <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">모델 간 주요 차이점 안내:</p>
            <ul className="list-disc list-inside space-y-0.5 text-amber-800">
              <li>
                <strong>J 모델(시·청각장애인용)</strong>: 촉각(점자)모니터 20Cell(1대)과 음성유도기 KW-1510A(1대)가 필수로 포함됩니다 (총 20종 부자재).
              </li>
              <li>
                <strong>T 모델(겸용 표준형)</strong>: 촉각(점자)모니터 및 음성유도기가 제외됩니다 (총 18종 부자재).
              </li>
              <li>
                <strong>9270 계열</strong>: 27인치 TFT Color LCD + IR(적외선) 터치스크린 (함체: 폭770 x 깊이810 x 높이1540)
              </li>
              <li>
                <strong>9320 계열</strong>: 32인치 대화면 LCD + 정전식 터치스크린 (함체: 폭824 x 깊이865 x 높이1652)
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Model Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MODELS_INFO.map((m) => {
          const isSelected = selectedModel === m.code
          return (
            <button
              key={m.code}
              onClick={() => setSelectedModel(m.code)}
              className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    m.isBarrierFree ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {m.isBarrierFree ? '장애인편의 (20개 부품)' : '겸용표준 (18개 부품)'}
                </span>
                {isSelected && <Check className="w-4 h-4 text-blue-600" />}
              </div>
              <h4 className="text-lg font-extrabold text-slate-900 mt-2">{m.code}</h4>
              <p className="text-xs text-blue-700 font-mono mt-0.5">식별번호: {m.identifier}</p>
              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <p>📏 {m.dimensions}</p>
                <p>🖥️ {m.displaySize}</p>
                <p>👆 {m.touchType}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Detailed BOM Table for Selected Model */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h4 className="font-extrabold text-slate-900 text-base">
              {selectedModel} 1대당 자재 소요량 명세 (총 {MODEL_BOM[selectedModel].length}개 항목)
            </h4>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            출처: 각 모델 규격서 3.1항
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4 w-14 text-center">No.</th>
                <th className="py-3 px-4">부품명</th>
                <th className="py-3 px-4">재질 및 규격 사양 (모델명)</th>
                <th className="py-3 px-4 text-center w-24">1대당 수량</th>
                <th className="py-3 px-4">특기사항 / 구분</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MODEL_BOM[selectedModel].map((item) => {
                const isSpecial =
                  item.name.includes('촉각') ||
                  item.name.includes('음성유도기') ||
                  item.name.includes('모니터') ||
                  item.name.includes('터치') ||
                  item.name.includes('함체')

                return (
                  <tr
                    key={item.no}
                    className={`transition ${isSpecial ? 'bg-blue-50/20' : 'hover:bg-slate-50'}`}
                  >
                    <td className="py-3 px-4 text-center font-mono text-slate-400 font-bold">
                      {item.no}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{item.spec}</td>
                    <td className="py-3 px-4 text-center font-mono font-extrabold text-blue-700">
                      {item.qty}개
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">
                      {item.name.includes('촉각') || item.name.includes('음성유도기') ? (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                          J모델 전용 (시청각장애인)
                        </span>
                      ) : item.name.includes('코인호퍼') ? (
                        <span className="text-slate-600">50원/100원/500원 총 3기</span>
                      ) : item.name.includes('감시카메라') ? (
                        <span className="text-slate-600">전면/상단 2기 탑재</span>
                      ) : (
                        item.note || '-'
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
