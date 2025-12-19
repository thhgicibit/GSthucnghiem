
import React, { useState } from 'react';
import { useAppContext } from '../AppContext';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: '1', name: 'Minh Tuấn', text: 'Mua vận chuyển xanh được tặng nhiều điểm GS lắm mọi người ơi!', time: '10:30' },
    { id: '2', name: 'Thanh Hà', text: 'Badge Đại Sứ Xanh nhìn xịn thật sự.', time: '11:05' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), name: 'Bạn', text: input, time: 'Vừa xong' }]);
    setInput('');
  };

  return (
    <section className="space-y-3">
      <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight px-1">Eco-Chat Community</h3>
      <div className="bg-white rounded-sm shadow-sm flex flex-col h-64 border border-slate-50">
        <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50/30">
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.name === 'Bạn' ? 'items-end' : 'items-start'}`}>
              <span className="text-[9px] font-bold text-slate-400 mb-1">{msg.name}</span>
              <div className={`max-w-[85%] px-3 py-2 rounded-lg text-[12px] leading-snug shadow-sm ${msg.name === 'Bạn' ? 'bg-shopee-orange text-white' : 'bg-white text-slate-700 border border-slate-100'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-slate-50 flex space-x-2 items-center bg-white">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Nhập nội dung chat..." 
            className="flex-1 bg-slate-50 rounded-sm px-3 py-2 text-[12px] focus:outline-none focus:bg-slate-100 transition-colors"
          />
          <button onClick={sendMessage} className="text-shopee-orange px-2 text-lg">➤</button>
        </div>
      </div>
    </section>
  );
};

export default Chat;
