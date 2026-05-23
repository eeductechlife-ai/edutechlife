import React from 'react';
import { Icon } from '../../../utils/iconMapping.jsx';

const ValerioMessageBubble = ({ msg }) => {
  const isUser = msg.type === 'user';
  const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-2xl p-4 break-words overflow-wrap-anywhere ${
        isUser
          ? 'bg-gradient-to-r from-petroleum to-corporate text-white'
          : 'bg-white border border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-start gap-3">
          {!isUser && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center text-white text-xs font-bold">
                V
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium opacity-80">
                {isUser ? 'Tú' : 'Valerio'}
              </span>
              <span className="text-xs opacity-60">{time}</span>
            </div>

            <div className={`prose prose-sm max-w-none ${
              isUser ? 'text-white' : 'text-petroleum-darker'
            }`}>
              {msg.content.split('\n').map((line, i) => (
                <p key={i} className="mb-2 last:mb-0">
                  {line}
                </p>
              ))}
            </div>
          </div>

          {isUser && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold">
                Tú
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ThinkingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-white border border-slate-200 rounded-2xl p-4 max-w-[80%]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-petroleum to-corporate flex items-center justify-center text-white text-xs font-bold">
          V
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  </div>
);

const EmptyState = ({ moduleTitle }) => (
  <div className="h-full flex items-center justify-center text-center p-8">
    <div>
      <div className="w-16 h-16 bg-gradient-to-r from-petroleum/10 to-corporate/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon name="fa-comments" className="text-corporate text-2xl" />
      </div>
      <h3 className="text-lg font-bold text-petroleum-darker mb-2">
        ¡Hablemos sobre {moduleTitle}!
      </h3>
      <p className="text-slate-600">
        Pregúntame lo que necesites sobre el módulo actual o selecciona una acción rápida.
      </p>
    </div>
  </div>
);

const ValerioConversationArea = ({ conversation, isProcessing, moduleTitle }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4" aria-live="polite" aria-label="Mensajes de la conversación">
      {conversation.length === 0 ? (
        <EmptyState moduleTitle={moduleTitle} />
      ) : (
        <div className="space-y-4">
          {conversation.map((msg) => (
            <ValerioMessageBubble key={msg.id} msg={msg} />
          ))}
          {isProcessing && <ThinkingIndicator />}
        </div>
      )}
    </div>
  );
};

export default ValerioConversationArea;
