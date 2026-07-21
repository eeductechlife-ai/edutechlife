import React from "react";

const UserProfileSection = ({
  userInfo,
  displayName,
  getUserInitials,
  handleAvatarClick,
  t,
}) => {
  return (
    <div className="p-3 bg-gradient-to-r from-petroleum to-corporate">
      <div className="flex items-center gap-2.5">
        <button
          onClick={handleAvatarClick}
          className="h-8 w-8 rounded-full overflow-hidden border border-white/30 hover:ring-2 hover:ring-white/50 transition-all duration-200 flex-shrink-0 cursor-pointer"
          aria-label={t("modals.settings.change_photo_aria")}
          title={t("modals.settings.change_photo_aria")}
        >
          {userInfo.avatarUrl ? (
            <img
              src={userInfo.avatarUrl}
              alt={displayName}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-semibold text-xs">
                {getUserInitials()}
              </span>
            </div>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">
            {displayName}
          </p>
          <p className="text-[10px] text-white/70 truncate">
            {userInfo.displayEmail}
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserProfileSection);
