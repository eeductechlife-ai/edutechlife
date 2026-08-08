import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { DropdownMenuLabel } from "../../ui/dropdown-menu";

const UserMenuHeader = ({ userInfo, avatarUrl, t, isSignedIn }) => (
  <DropdownMenuLabel className="p-5 border-b border-slate-100 bg-slate-50">
    <div className="flex items-center gap-3">
      <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={userInfo.displayName} />
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-[#004B63] to-[#00BCD4] text-white text-lg font-semibold">
            {userInfo.initials}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#00374A] truncate">
          {userInfo.displayName}
        </p>
        <p className="text-xs text-slate-400 truncate">
          {userInfo.displayEmail}
        </p>
        <div className="flex items-center gap-1 mt-2">
          <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 uppercase font-bold rounded-full">
            {userInfo.role === "teacher"
              ? t("mobile_menu.role_teacher")
              : t("mobile_menu.role_student")}
          </span>
          {isSignedIn && (
            <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 uppercase font-bold rounded-full">
              Clerk
            </span>
          )}
        </div>
      </div>
    </div>
  </DropdownMenuLabel>
);

export default UserMenuHeader;
