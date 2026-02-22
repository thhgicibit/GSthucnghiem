import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { UserDemographics } from '../types';
import { dataService } from '../dataService';

const Survey: React.FC = () => {
  const { setUserDemographics, setCurrentStep, userEmail } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [answers, setAnswers] = useState<Partial<UserDemographics>>({
    gender: '', age: '', education: '', job: '', income: '', gamificationExp: '', knownGame: '',
    sent_q1: '', sent_q2: '', sent_q3: '', sent_q4: '', sent_q5: '', sent_q6: '',
    know_q1: '', know_q2: '', know_q3: '', know_q4: '', know_q5: ''
  });

  const updateAnswer = (field: keyof UserDemographics, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    dataService.logSurvey1Response(userEmail, field, value);
  };

  const isPageValid = () => {
    if (currentPage === 1) {
      return !!(answers.gender && answers.age && answers.education && answers.job && answers.income && answers.gamificationExp && answers.knownGame);
    }
    if (currentPage === 2) {
      return !!(
        answers.sent_q1 && answers.sent_q2 && answers.sent_q3 && answers.sent_q4 && answers.sent_q5 && answers.sent_q6 &&
        answers.know_q1 && answers.know_q2 && answers.know_q3 && answers.know_q4 && answers.know_q5
      );
    }
    return false;
  };

  const handleNext = () => {
    if (!isPageValid()) {
      setShowValidationErrors(true);
      setTimeout(() => {
        const firstError = document.querySelector('.border-red-500');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }
    setShowValidationErrors(false);
    if (currentPage < 2) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      setUserDemographics(answers as UserDemographics);
      setCurrentStep('instruction');
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo(0, 0);
    } else {
      setCurrentStep('login');
    }
  };

  const renderRadioGroup = (field: keyof UserDemographics, label: string, options: string[]) => {
    const isInvalid = showValidationErrors && !answers[field];
    return (
      <div className={`bg-white p-6 rounded-lg border shadow-sm mb-4 overflow-hidden transition-all ${isInvalid ? 'border-red-500 bg-red-50/30' : 'border-slate-200'}`}>
        <div className="mb-4">
          <label className="text-base font-medium text-slate-800">{label} <span className="text-red-500">*</span></label>
          {isInvalid && <p className="text-red-500 text-xs font-bold mt-1 uppercase tracking-wider">Vui lòng chọn một câu trả lời</p>}
        </div>
        <div className="space-y-3">
          {options.map((option) => (
            <label key={option} className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name={field}
                  value={option}
                  checked={answers[field] === option}
                  onChange={() => updateAnswer(field, option)}
                  className="appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-emerald-500 transition-all cursor-pointer"
                />
                {answers[field] === option && <div className="absolute w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>}
              </div>
              <span className="text-base text-slate-700 group-hover:text-emerald-600 transition-colors">{option}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const COL_W = 56;
  const TOTAL_W = COL_W * 5;

  const renderLikertSection = (title: string, questions: { field: keyof UserDemographics, text: string }[]) => {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm mb-4 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/30">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{title} <span className="text-red-500">*</span></h3>
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
          {questions.map((q, idx) => {
            const isInvalid = showValidationErrors && !answers[q.field];
            return (
              <div
                key={q.field}
                className={`px-6 py-5 border-b border-slate-100 last:border-0 transition-all ${
                  isInvalid ? 'bg-red-50 border-l-4 border-red-500' : (idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30')
                }`}
              >
                {/* Desktop */}
                <div className="hidden md:flex items-center">
                  <div className="flex-1 text-sm font-medium text-slate-700 leading-relaxed pr-4">
                    {q.text}
                    {isInvalid && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">Vui lòng chọn</p>}
                  </div>
                  <div className="flex shrink-0" style={{ width: TOTAL_W }}>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={num} className="flex flex-col items-center" style={{ width: COL_W }}>
                        <label className="relative flex items-center justify-center cursor-pointer group w-8 h-8">
                          <input
                            type="radio"
                            name={q.field}
                            value={num.toString()}
                            checked={answers[q.field] === num.toString()}
                            onChange={() => updateAnswer(q.field, num.toString())}
                            className="appearance-none w-7 h-7 border-2 border-slate-300 rounded-full checked:border-emerald-500 transition-all cursor-pointer"
                          />
                          {answers[q.field] === num.toString() && (
                            <div className="absolute w-3.5 h-3.5 bg-emerald-500 rounded-full pointer-events-none" />
                          )}
                          <div className="absolute inset-0 rounded-full group-hover:bg-emerald-50 transition-colors -z-10" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                  <p className="text-sm font-medium text-slate-700 leading-relaxed mb-3">
                    {q.text}
                    {isInvalid && <span className="text-red-500 text-[10px] font-bold ml-2 uppercase tracking-wider">Vui lòng chọn</span>}
                  </p>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="flex justify-between w-full text-[10px] font-bold text-emerald-700 uppercase tracking-tighter mb-2 px-1">
                      <span>Hoàn toàn không đồng ý</span>
                      <span>Hoàn toàn đồng ý</span>
                    </div>
                    <div className="flex justify-between w-full">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className="flex flex-col items-center flex-1">
                          <span className="text-xs font-bold text-slate-400 mb-1">{num}</span>
                          <label className="relative flex items-center justify-center cursor-pointer w-8 h-8">
                            <input
                              type="radio"
                              name={q.field}
                              value={num.toString()}
                              checked={answers[q.field] === num.toString()}
                              onChange={() => updateAnswer(q.field, num.toString())}
                              className="appearance-none w-7 h-7 border-2 border-slate-300 rounded-full checked:border-emerald-500 transition-all cursor-pointer"
                            />
                            {answers[q.field] === num.toString() && (
                              <div className="absolute w-3.5 h-3.5 bg-emerald-500 rounded-full pointer-events-none" />
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] py-8 px-4 flex flex-col items-center font-sans">
      <div className="w-full max-w-3xl mb-6">
        <div className="h-3 w-full bg-emerald-600 rounded-t-xl"></div>
        <div className="bg-white p-8 rounded-b-xl border-x border-b border-slate-200 shadow-sm relative overflow-hidden text-justify">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight leading-tight">
            {currentPage === 1 ? "THÔNG TIN NHÂN KHẨU HỌC" : "NGHIÊN CỨU 1 - NGHIÊN CỨU THỰC NGHIỆM"}
          </h1>
          <p className="text-base text-slate-600 leading-relaxed italic">
            Anh/Chị vui lòng trả lời các câu hỏi dưới đây.
          </p>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-base font-black text-slate-400 uppercase tracking-[0.2em]">
            <span>Trang {currentPage} / 2</span>
            <span className="text-red-500">* Bắt buộc</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl">
        {currentPage === 1 && (
          <div className="animate-slideUp space-y-4">
            {renderRadioGroup('gender', 'A1. Giới tính của Anh/Chị là:', ['Nam', 'Nữ'])}
            {renderRadioGroup('age', 'A2. Độ tuổi của Anh/Chị là:', ['18 – 24', '25 – 30', '31 – 35', '36 – 40', 'Trên 40'])}
            {renderRadioGroup('education', 'A3. Trình độ học vấn cao nhất của Anh/Chị là:', ['Dưới trung học phổ thông', 'Cao đẳng/ Đại học', 'Sau đại học'])}
            {renderRadioGroup('job', 'A4. Loại hình nghề nghiệp/ Vị trí công việc hiện tại của Anh/Chị là:', [
              'Học sinh, Sinh viên', 'Nhân viên văn phòng', 'Quản lý cấp trung (Quản lý, trưởng nhóm)',
              'Quản lý cấp cao (Giám đốc, phó giám đốc,...)', 'Freelancer (Lao động tự do)', 'Nội trợ/ chưa đi làm', 'Mục khác'
            ])}
            {renderRadioGroup('income', 'A5. Thu nhập cá nhân trung bình hàng tháng của Anh/Chị là:', ['Dưới 5 triệu VNĐ', 'Từ 5 – 10 triệu VNĐ', 'Từ 10 – 20 triệu VNĐ', 'Trên 20 triệu VNĐ'])}

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <label className="text-base font-medium text-slate-800 block mb-2">
                A6. Anh/Chị đã từng tương tác với các ứng dụng hoặc nền tảng có tích hợp cơ chế trò chơi hóa (Gamification) chưa? <span className="text-red-500">*</span>
              </label>
              <p className="text-base text-slate-500 mb-6 italic">(Ví dụ: Trồng cây trên Shopee/Lazada, làm nhiệm vụ tích xu trên Momo, học tập trên Duolingo, chạy bộ UpRace...)</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
                  <img src="https://image2url.com/r2/default/images/1771598523898-0d7d2802-b5bc-4466-b99b-be9ca43c1b45.png" className="w-full h-auto" alt="Example 1" />
                  <p className="p-2 text-base text-center text-slate-400 font-bold uppercase">Game "Nông trại Shopee"</p>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
                  <img src="https://image2url.com/r2/default/images/1771598631402-830ed18b-15cb-41b8-82c4-44b54cc04a7e.png" className="w-full h-auto" alt="Example 2" />
                  <p className="p-2 text-base text-center text-slate-400 font-bold uppercase">Game "Nhiệm vụ tích xu" của MoMo Xu</p>
                </div>
              </div>
              <div className="space-y-3">
                {['Đã từng', 'Có thấy nhưng chưa tham gia', 'Chưa từng'].map((option) => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer group">
                    <input type="radio" name="gamificationExp" value={option} checked={answers.gamificationExp === option} onChange={() => updateAnswer('gamificationExp', option)} className="w-5 h-5 accent-emerald-600" />
                    <span className="text-base text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <label className="text-base font-medium text-slate-800 block mb-4">
                A7. Hãy kể tên một game mà bạn đã từng chơi/biết hoặc đã từng thấy: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Câu trả lời của bạn"
                value={answers.knownGame}
                onChange={(e) => updateAnswer('knownGame', e.target.value)}
                className="w-full border-b-2 border-slate-200 focus:border-emerald-500 outline-none py-2 text-base transition-all"
              />
            </div>
          </div>
        )}

        {currentPage === 2 && (
          <div className="animate-slideUp space-y-4">
            <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm leading-relaxed text-justify">
              <h3 className="text-base font-black text-slate-800 mb-6 uppercase tracking-wider underline underline-offset-8 decoration-emerald-500">Giải thích thuật ngữ</h3>
              <ul className="space-y-6">
                <li className="flex items-start space-x-4">
                  <div>
                    <p className="font-bold text-slate-800 text-base">Trò chơi hóa (Gamification):</p>
                    <p className="text-base text-slate-600 mt-1">Là việc áp dụng các yếu tố, quy tắc và cơ chế của trò chơi vào những lĩnh vực không phải là trò chơi (như kinh doanh, marketing, giáo dục, sức khỏe,...). Mục đích là tăng sự tham gia, tạo động lực và thúc đẩy hành vi mong muốn từ người dùng.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <div>
                    <p className="font-bold text-slate-800 text-base">Giao hàng chặng cuối (Last Mile Delivery):</p>
                    <p className="text-base text-slate-600 mt-1">Là thuật ngữ chỉ công đoạn vận chuyển hàng hóa từ trung tâm phân phối gần nhất đến tay người tiêu dùng cuối cùng.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-600 text-white p-6 md:p-10 rounded-lg shadow-sm text-justify">
              <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-4">KHẢO SÁT VỀ TÌNH CẢM VÀ KIẾN THỨC MÔI TRƯỜNG TRƯỚC THỰC NGHIỆM</h3>
              <p className="text-base leading-relaxed opacity-90">Anh/Chị vui lòng đánh giá mức độ đồng ý của mình đối với các phát biểu dưới đây về tình cảm và kiến thức đối với môi trường bằng cách chọn một con số từ 1 đến 5, trong đó:</p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-6 text-[12px] md:text-base font-medium text-center opacity-90">
                <span className="whitespace-nowrap">1: Hoàn toàn không đồng ý</span>
                <span className="whitespace-nowrap">2: Không đồng ý</span>
                <span className="whitespace-nowrap">3: Bình thường</span>
                <span className="whitespace-nowrap">4: Đồng ý</span>
                <span className="whitespace-nowrap">5: Hoàn toàn đồng ý</span>
              </div>
            </div>

            {renderLikertSection('Câu hỏi tình cảm môi trường', [
              { field: 'sent_q1', text: 'Q1. Tôi coi trọng việc sử dụng các sản phẩm không gây hại đến môi trường' },
              { field: 'sent_q2', text: 'Q2. Thói quen mua sắm của tôi có sự thay đổi từ khi quan tâm đến môi trường' },
              { field: 'sent_q3', text: 'Q3. Tôi lo ngại về việc lãng phí các nguồn tài nguyên của trái đất' },
              { field: 'sent_q4', text: 'Q4. Tôi cân nhắc đến những tác động tiềm ẩn đối với môi trường từ hành động của mình khi đưa ra các quyết định' },
              { field: 'sent_q5', text: 'Q5. Khi có sự lựa chọn giữa hai sản phẩm tương đương, tôi chọn sản phẩm ít gây hại hơn cho con người và môi trường' },
              { field: 'sent_q6', text: 'Q6. Tôi đã từng quyết định không mua một sản phẩm khi biết rằng nó có khả năng gây hại cho môi trường' }
            ])}

            {renderLikertSection('Câu hỏi kiến thức môi trường', [
              { field: 'know_q1', text: 'Q1. Tôi hiểu ý nghĩa của việc tiết kiệm năng lượng hiệu quả (dùng ít năng lượng hơn) của các phương tiện xanh dùng trong giao hàng chặng cuối' },
              { field: 'know_q2', text: 'Q2. Tôi hiểu ý nghĩa của tính thân thiện với môi trường (giúp giảm khí thải, ít gây ô nhiễm hơn) trong các phương tiện xanh dùng cho chặng giao hàng cuối cùng' },
              { field: 'know_q3', text: 'Q3. Tôi nhận thức được những tác động của biến đổi khí hậu đối với môi trường và con người' },
              { field: 'know_q4', text: 'Q4. Khi đọc mô tả sản phẩm, tôi có thể hiểu được liệu sản phẩm đó có gây hại cho môi trường hay không' },
              { field: 'know_q5', text: 'Q5. Tôi dễ dàng nhận biết được sản phẩm thân thiện với môi trường' }
            ])}
          </div>
        )}

        <div className="flex justify-between items-center mt-10 mb-20 px-2">
          <button onClick={handleBack} className="px-4 md:px-8 py-3 text-emerald-600 font-black text-sm md:text-base uppercase tracking-[0.1em] md:tracking-[0.2em] hover:bg-emerald-50 rounded-xl transition-all">← Quay lại</button>
          <button
            onClick={handleNext}
            disabled={!isPageValid()}
            className={`px-6 md:px-12 py-4 rounded-xl font-black uppercase text-sm md:text-base tracking-[0.1em] md:tracking-[0.2em] transition-all shadow-xl ${
              isPageValid() ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {currentPage === 2 ? 'Tiếp tục' : 'Tiếp theo →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Survey;
