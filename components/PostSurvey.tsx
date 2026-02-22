
import React, { useState } from 'react';
import { useAppContext } from '../AppContext';

const PostSurvey: React.FC = () => {
  const { setCurrentStep, lastSimulationStep } = useAppContext();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const sections = [
    {
      id: 'GLI',
      title: 'Ý ĐỊNH THỰC HIỆN HÀNH VI LOGISTICS XANH (GLI)',
      questions: [
        { id: 'GLI1', text: 'Tôi có ý định tham gia vào các hành vi logistics xanh để bảo vệ môi trường.' },
        { id: 'GLI2', text: 'Trong thời gian tới, tôi có ý định hạn chế những hành vi gây lãng phí trong quá trình giao hàng khi mua sắm trực tuyến (như bao bì, thời gian và chi phí vận chuyển).' },
        { id: 'GLI3', text: 'Tôi có ý định giảm thiểu lượng rác thải phát sinh từ các hoạt động mua sắm trực tuyến và giao hàng trong những tháng tới.' },
      ]
    },
    {
      id: 'GCI',
      title: 'Ý ĐỊNH TIÊU DÙNG XANH (GCI)',
      questions: [
        { id: 'GCI1', text: 'Tôi dự định sẽ mua các sản phẩm thân thiện với môi trường (như thực phẩm hữu cơ hoặc sản phẩm tiết kiệm năng lượng) trong tháng tới.' },
        { id: 'GCI2', text: 'Tôi sẵn sàng chuyển sang mua sắm tại các thương hiệu khác vì lý do bảo vệ môi trường.' },
        { id: 'GCI3', text: 'Tôi sẵn sàng trả giá cao hơn cho một sản phẩm nếu nó tốt cho sức khỏe hoặc giúp bảo vệ môi trường.' },
        { id: 'GCI4', text: 'Tôi sẽ cân nhắc mua các sản phẩm xanh vì chúng gây ít ô nhiễm hơn.' },
        { id: 'GCI5', text: 'Tôi muốn các sàn giao dịch TMĐT có hệ thống tích điểm xanh.' },
        { id: 'GCI6', text: 'Sử dụng game tích điểm xanh là một ý tưởng hay.' },
        { id: 'GCI7', text: 'Tôi sẽ giới thiệu cho bạn bè về hệ thống tích điểm xanh nếu có hình thức này.' },
      ]
    },
    {
      id: 'PE',
      title: 'NHẬN THỨC VỀ SỰ THÍCH THÚ (PE)',
      questions: [
        { id: 'PE1', text: 'Tôi cảm thấy thích thú khi sử dụng Điểm Xanh.' },
        { id: 'PE2', text: 'Tôi thấy việc sử dụng Điểm Xanh thú vị.' },
        { id: 'PE3', text: 'Sử dụng Điểm Xanh mang lại cảm giác dễ chịu.' },
      ]
    },
    {
      id: 'PU',
      title: 'NHẬN THỨC VỀ TÍNH HỮU ÍCH (PU)',
      description: 'Định nghĩa: Mức độ người dùng tin rằng hệ thống trò chơi tích điểm Điểm Xanh giúp họ thực hiện hành vi tiêu dùng xanh hiệu quả hơn trên nền tảng thương mại điện tử',
      questions: [
        { id: 'PU1', text: 'Tôi cảm thấy Điểm Xanh giúp tôi thực hiện các hoạt động mua sắm trực tuyến nhanh chóng hơn.' },
        { id: 'PU2', text: 'Tôi cảm thấy Điểm Xanh giúp tôi thực hiện các hoạt động mua sắm trực tuyến hiệu quả hơn.' },
        { id: 'PU3', text: 'Tôi thấy Điểm Xanh hữu ích (giúp tôi thực hiện và duy trì lối sống bền vững dễ dàng hơn).' },
      ]
    },
    {
      id: 'PEOU',
      title: 'NHẬN THỨC VỀ TÍNH DỄ SỬ DỤNG (PEOU)',
      questions: [
        { id: 'PEOU1', text: 'Giao diện tương tác của Điểm Xanh rõ ràng và dễ hiểu.' },
        { id: 'PEOU2', text: 'Tôi thấy Điểm Xanh dễ sử dụng.' },
        { id: 'PEOU3', text: 'Tôi dễ dàng hoàn thành các tác vụ tôi mong muốn trên Hệ thống Điểm Xanh.' },
      ]
    },
    {
      id: 'INT',
      title: 'KHẢ NĂNG GỢI MỞ TƯƠNG TÁC (INT)',
      questions: [
        { id: 'INT1', text: 'Điểm Xanh hỗ trợ tôi trong việc tương tác với bạn bè.' },
        { id: 'INT2', text: 'Điểm Xanh mang đến cho tôi cơ hội giao lưu với những người tham gia khác.' },
        { id: 'INT3', text: 'Điểm Xanh cung cấp cho tôi một hình thức để thúc đẩy sự tương tác và đối thoại với bạn bè.' },
      ]
    },
    {
      id: 'SEE',
      title: 'KHẢ NĂNG GỢI MỞ TỰ THỂ HIỆN (SEE)',
      questions: [
        { id: 'SEE1', text: 'Tôi có thể thể hiện bản sắc cá nhân thông qua hệ thống tích điểm xanh.' },
        { id: 'SEE2', text: 'Tôi được thể hiện bản thân theo cách tôi muốn trên Điểm Xanh.' },
        { id: 'SEE3', text: 'Tôi có thể tạo sự khác biệt giữa bản thân và những người khác trên Điểm Xanh.' },
      ]
    },
    {
      id: 'ACH',
      title: 'KHẢ NĂNG GỢI MỞ THÀNH TÍCH (ACH)',
      questions: [
        { id: 'ACH1', text: 'Tôi có thể khoe với người khác về các thành tích xanh mà tôi đạt được trên nền tảng này.' },
        { id: 'ACH2', text: 'Game tích điểm xanh cho tôi cơ hội thể hiện thành tích của mình khi tham gia vào các hoạt động tiêu dùng xanh.' },
        { id: 'ACH3', text: 'Điểm Xanh cho phép tôi thể hiện mức độ tham gia của mình vào các hoạt động tiêu dùng xanh.' },
      ]
    },
    {
      id: 'COM',
      title: 'KHẢ NĂNG GỢI MỞ CẠNH TRANH (COM)',
      questions: [
        { id: 'COM1', text: 'Game tích điểm xanh có tính cạnh tranh.' },
        { id: 'COM2', text: 'Tôi có thể so sánh thành tích của mình với người khác trên Game tích Điểm Xanh.' },
        { id: 'COM3', text: 'Điểm Xanh tạo cơ hội cho tôi cạnh tranh thứ hạng của những người khác thông qua việc tham gia tích cực của mình.' },
      ]
    }
  ];

  // Mỗi cột radio rộng 56px × 5 cột = 280px — dùng nhất quán ở header lẫn rows
  const COL_W = 56;
  const TOTAL_W = COL_W * 5;

  const handleSelect = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const isComplete = () => {
    const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0);
    return Object.keys(answers).length === totalQuestions;
  };

  const handleSubmit = () => {
    if (!isComplete()) {
      setShowValidationErrors(true);
      setTimeout(() => {
        const firstError = document.querySelector('.bg-red-50');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }
    alert('Cảm ơn bạn đã hoàn thành khảo sát sau mô phỏng!');
    setCurrentStep('login');
  };

  const handleBack = () => {
    setCurrentStep(lastSimulationStep || 'success');
  };

  const RadioGroup = ({ qId, isMobile }: { qId: string, isMobile?: boolean }) => (
    <div className={`flex ${isMobile ? 'w-full justify-between' : 'shrink-0'}`} style={isMobile ? {} : { width: TOTAL_W }}>
      {[1, 2, 3, 4, 5].map(num => (
        <div key={num} className="flex flex-col items-center" style={isMobile ? { flex: 1 } : { width: COL_W }}>
          {/* Số — chỉ hiện trên mobile */}
          <span className="md:hidden text-xs font-bold text-slate-400 mb-1">{num}</span>
          <label className="relative flex items-center justify-center cursor-pointer group w-8 h-8">
            <input
              type="radio"
              name={qId}
              value={num.toString()}
              checked={answers[qId] === num.toString()}
              onChange={() => handleSelect(qId, num.toString())}
              className="appearance-none w-7 h-7 border-2 border-slate-300 rounded-full checked:border-emerald-500 transition-all cursor-pointer"
            />
            {answers[qId] === num.toString() && (
              <div className="absolute w-3.5 h-3.5 bg-emerald-500 rounded-full pointer-events-none" />
            )}
            <div className="absolute inset-0 rounded-full group-hover:bg-emerald-50 transition-colors -z-10" />
          </label>
        </div>
      ))}
    </div>
  );

  const renderSection = (section: any) => (
    <div key={section.id} className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4 overflow-hidden">

      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100 bg-slate-50/30">
        <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">
          {section.title} <span className="text-red-500">*</span>
        </h3>
        {section.description && (
          <p className="mt-2 text-xs text-slate-600 leading-relaxed italic border-l-2 border-emerald-500 pl-3">
            {section.description}
          </p>
        )}

        {/* Desktop column headers — khớp chính xác với RadioGroup */}
        <div className="mt-4 hidden md:flex items-start">
          <div className="flex-1 text-sm font-semibold text-slate-400 pr-4">Nội dung</div>
          <div className="flex shrink-0" style={{ width: TOTAL_W }}>
            {[1, 2, 3, 4, 5].map((n, i) => (
              <div key={n} className="flex flex-col items-center" style={{ width: COL_W }}>
                <span className="text-sm font-bold text-slate-500">{n}</span>
                {i === 0 && (
                  <span className="text-[10px] font-semibold text-emerald-700 text-center leading-tight mt-0.5">
                    Hoàn toàn không<br />đồng ý
                  </span>
                )}
                {i === 4 && (
                  <span className="text-[10px] font-semibold text-emerald-700 text-center leading-tight mt-0.5">
                    Hoàn toàn<br />đồng ý
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rows */}
      <div>
        {section.questions.map((q, idx) => {
          const isInvalid = showValidationErrors && !answers[q.id];
          return (
            <div
              key={q.id}
              className={`px-6 py-5 border-b border-slate-100 last:border-0 transition-all ${isInvalid ? 'bg-red-50 border-l-4 border-red-500' : (idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40')}`}
            >
              {/* Desktop: text + radio nằm ngang */}
              <div className="hidden md:flex items-center">
                <div className="flex-1 text-sm font-medium text-slate-700 leading-relaxed pr-4">
                  <span className="font-bold">{q.id}.</span> {q.text}
                  {isInvalid && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">Vui lòng chọn</p>}
                </div>
                <RadioGroup qId={q.id} />
              </div>

              {/* Mobile: text trên, radio dưới */}
              <div className="md:hidden">
                <p className="text-sm font-medium text-slate-700 leading-relaxed mb-4">
                  <span className="font-bold">{q.id}.</span> {q.text}
                  {isInvalid && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">Vui lòng chọn</p>}
                </p>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex justify-between w-full text-[10px] font-bold text-emerald-700 uppercase tracking-tighter mb-2 px-1">
                    <span>Hoàn toàn không đồng ý</span>
                    <span>Hoàn toàn đồng ý</span>
                  </div>
                  <RadioGroup qId={q.id} isMobile />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F4F8] py-8 px-4 flex flex-col items-center overflow-y-auto">

      {/* Page Header */}
      <div className="w-full max-w-3xl mb-6">
        <div className="h-3 w-full bg-emerald-600 rounded-t-xl" />
        <div className="bg-white p-8 rounded-b-xl border-x border-b border-slate-200 shadow-sm text-justify">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight leading-tight">
            NGHIÊN CỨU 2 - NGHIÊN CỨU DỮ LIỆU ĐIỀU TRA
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed italic">
            Anh/Chị vui lòng đánh giá mức độ đồng ý của mình dựa trên trải nghiệm tại hệ thống Điểm Xanh vừa rồi.
          </p>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
            <span>Nghiên cứu 2</span>
            <span className="text-red-500">* Bắt buộc</span>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="w-full max-w-3xl">
        {sections.map(section => renderSection(section))}

        {/* Actions */}
        <div className="flex justify-between items-center mt-10 mb-20 px-2">
          <button onClick={handleBack} className="px-4 md:px-8 py-3 text-emerald-600 font-black text-sm md:text-base uppercase tracking-[0.1em] md:tracking-[0.2em] hover:bg-emerald-50 rounded-xl transition-all">← Quay lại</button>
          <button
            onClick={handleSubmit}
            className={`px-6 md:px-12 py-4 rounded-xl font-black uppercase text-sm md:text-base tracking-[0.1em] md:tracking-[0.2em] transition-all shadow-xl
              ${isComplete()
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                : 'bg-slate-200 text-slate-400 shadow-none'}`}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostSurvey;
