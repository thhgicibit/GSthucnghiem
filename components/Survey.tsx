
import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { UserDemographics } from '../types';

const QUESTIONS = [
  {
    id: 'gender',
    title: 'A1. Giới tính của Anh/Chị là:',
    options: ['Nam', 'Nữ']
  },
  {
    id: 'age',
    title: 'A2. Độ tuổi của Anh/Chị là:',
    options: ['18 – 24', '25 – 30', '31 – 35', '36 – 40', 'Trên 40']
  },
  {
    id: 'education',
    title: 'A3. Trình độ học vấn cao nhất của Anh/Chị là:',
    options: ['Dưới trung học phổ thông', 'Cao đẳng/ Đại học', 'Sau đại học']
  },
  {
    id: 'job',
    title: 'A4. Loại hình nghề nghiệp hiện tại của Anh/Chị là:',
    options: [
      'Học sinh, Sinh viên',
      'Nhân viên văn phòng',
      'Quản lý cấp trung (Quản lý, trưởng nhóm)',
      'Quản lý cấp cao (Giám đốc, phó giám đốc,...)',
      'Freelancer (Lao động tự do)',
      'Nội trợ/ chưa đi làm'
    ]
  },
  {
    id: 'income',
    title: 'A5. Thu nhập cá nhân trung bình hàng tháng của Anh/Chị là:',
    options: ['Dưới 5 triệu VNĐ', 'Từ 5 – 10 triệu VNĐ', 'Từ 10 – 20 triệu VNĐ', 'Trên 20 triệu VNĐ']
  }
];

const Survey: React.FC = () => {
  const { setUserDemographics, setCurrentStep } = useAppContext();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<UserDemographics>>({});

  const handleSelect = (option: string) => {
    const currentQ = QUESTIONS[currentQIndex];
    const newAnswers = { ...answers, [currentQ.id]: option };
    setAnswers(newAnswers);

    if (currentQIndex < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQIndex(prev => prev + 1), 300);
    } else {
      setUserDemographics(newAnswers as UserDemographics);
      setTimeout(() => setCurrentStep('shop'), 300);
    }
  };

  const progress = ((currentQIndex + 1) / QUESTIONS.length) * 100;
  const currentQuestion = QUESTIONS[currentQIndex];

  return (
    <div className="min-h-screen bg-emerald-600 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-100">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="p-8 md:p-12">
          <div className="mb-8">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Khảo sát thông tin ({currentQIndex + 1}/{QUESTIONS.length})</span>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 mt-2 leading-tight">
              {currentQuestion.title}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group
                  ${answers[currentQuestion.id as keyof UserDemographics] === option 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-slate-100 hover:border-emerald-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <span className="font-bold text-sm md:text-base">{option}</span>
                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                  ${answers[currentQuestion.id as keyof UserDemographics] === option 
                    ? 'border-emerald-500 bg-emerald-500 text-white' 
                    : 'border-slate-200 group-hover:border-emerald-300'}`}>
                  {answers[currentQuestion.id as keyof UserDemographics] === option && '✓'}
                </span>
              </button>
            ))}
          </div>

          {currentQIndex > 0 && (
            <button 
              onClick={() => setCurrentQIndex(prev => prev - 1)}
              className="mt-8 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              ← Quay lại câu trước
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Survey;
