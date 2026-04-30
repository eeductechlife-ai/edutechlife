import React, { useState, useRef } from 'react';
import { useUser } from '@clerk/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card-simple';
import { Icon } from '../../utils/iconMapping.jsx';

const ChangeAvatarModal = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen no debe superar los 10MB');
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      await user.setProfileImage({ file });
      setSuccess('Foto de perfil actualizada correctamente');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('No se pudo actualizar la foto. Intenta de nuevo.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm('¿Eliminar tu foto de perfil?')) return;

    setUploading(true);
    setError('');

    try {
      await user.deleteProfileImage();
      setSuccess('Foto eliminada correctamente');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error deleting avatar:', err);
      setError('No se pudo eliminar la foto. Intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const avatarUrl = user?.imageUrl || '';
  const initials = user?.firstName?.[0]?.toUpperCase() || user?.fullName?.[0]?.toUpperCase() || 'U';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <Card className="w-full max-w-sm bg-white rounded-xl border border-slate-200/60 shadow-lg relative z-10 animate-in fade-in-0 zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 rounded-full transition-all duration-200"
          aria-label="Cerrar"
        >
          <Icon name="fa-times" className="text-lg" />
        </button>

        <CardHeader className="border-b border-slate-200/60 bg-white pb-4 pt-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center">
              <Icon name="fa-camera" className="text-[#004B63]" />
            </div>
            <CardTitle className="text-slate-800 font-bold text-sm">Foto de Perfil</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          {/* Vista previa */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full object-cover border-4 border-slate-200/60 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#004B63] to-[#00BCD4] flex items-center justify-center border-4 border-slate-200/60 shadow-md">
                  <span className="text-white font-bold text-3xl">{initials}</span>
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                <Icon name="fa-camera" className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-xl" />
              </div>
            </div>
          </div>

          {/* Mensajes */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2">
              <Icon name="fa-exclamation-circle" className="text-rose-500 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-xs text-rose-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2">
              <Icon name="fa-check-circle" className="text-emerald-500 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-xs text-emerald-700">{success}</p>
            </div>
          )}

          {/* Acciones */}
          <div className="space-y-2">
            {/* Subir desde dispositivo */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 text-left disabled:opacity-50"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0">
                <Icon name="fa-folder-open" className="text-[#004B63] text-xs" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-slate-800">Subir desde dispositivo</span>
                <p className="text-[10px] text-slate-500">JPG, PNG o GIF (máx. 10MB)</p>
              </div>
            </button>

            {/* Tomar con cámara */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-[#004B63] rounded-lg shadow-sm hover:shadow hover:border-l-[#00BCD4] hover:bg-slate-50 transition-all duration-300 text-left disabled:opacity-50"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#004B63]/10 to-[#00BCD4]/10 flex items-center justify-center flex-shrink-0">
                <Icon name="fa-camera" className="text-[#004B63] text-xs" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-slate-800">Tomar con cámara</span>
                <p className="text-[10px] text-slate-500">Usa la cámara de tu dispositivo</p>
              </div>
            </button>

            {/* Eliminar foto (solo si existe) */}
            {avatarUrl && (
              <button
                onClick={handleDeleteAvatar}
                disabled={uploading}
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/60 border-l-4 border-l-rose-400 rounded-lg shadow-sm hover:shadow hover:border-l-rose-500 hover:bg-rose-50/50 transition-all duration-300 text-left disabled:opacity-50"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-400/10 to-rose-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="fa-trash" className="text-rose-500 text-xs" />
                </div>
                <span className="text-xs font-semibold text-rose-600">Eliminar foto actual</span>
              </button>
            )}
          </div>

          {/* Loading overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Icon name="fa-spinner" className="text-2xl text-[#00BCD4] animate-spin" />
                <p className="text-xs text-slate-500">Actualizando foto...</p>
              </div>
            </div>
          )}

          {/* Inputs ocultos */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeAvatarModal;
