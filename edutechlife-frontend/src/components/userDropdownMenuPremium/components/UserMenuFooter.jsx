import { DropdownMenuItem, DropdownMenuSeparator } from '../../ui/dropdown-menu';
import { Icon } from '../../../utils/iconMapping.jsx';

const UserMenuFooter = ({ onLogout, t }) => (
  <>
    <DropdownMenuSeparator className="bg-slate-100" />
    <DropdownMenuItem
      className="flex items-center gap-3 px-4 py-3 w-full text-left cursor-pointer text-rose-600 hover:bg-rose-50 transition-colors duration-200 border-t border-slate-100"
      onClick={onLogout}
    >
      <div className="w-5 h-5 flex items-center justify-center">
        <Icon name="fa-sign-out" className="text-sm" />
      </div>
      <span className="text-sm font-medium">{t('sidebar.logout')}</span>
    </DropdownMenuItem>
  </>
);

export default UserMenuFooter;
