import { DropdownMenuItem, DropdownMenuGroup } from '../../ui/dropdown-menu';
import { Icon } from '../../../utils/iconMapping.jsx';

const UserMenuItems = ({ t, onProfile, onHistory, onStudyPlanner, onSettings, onCertificates, onChangePassword }) => (
  <DropdownMenuGroup className="p-2">
    <DropdownMenuItem
      className="flex items-center gap-3 px-4 py-3 w-full text-left cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors duration-200"
      onClick={onProfile}
    >
      <div className="w-5 h-5 flex items-center justify-center text-slate-500 group-hover:text-indigo-600">
        <Icon name="fa-user-circle" className="text-sm" />
      </div>
      <span className="text-sm font-medium">{t('mobile_menu.my_profile')}</span>
    </DropdownMenuItem>

    <DropdownMenuItem
      className="flex items-center gap-3 px-4 py-3 w-full text-left cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors duration-200"
      onClick={onHistory}
    >
      <div className="w-5 h-5 flex items-center justify-center text-slate-500 group-hover:text-indigo-600">
        <Icon name="fa-chart-line" className="text-sm" />
      </div>
      <span className="text-sm font-medium">{t('mobile_menu.my_history')}</span>
    </DropdownMenuItem>

    <DropdownMenuItem
      className="flex items-center gap-3 px-4 py-3 w-full text-left cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors duration-200"
      onClick={onStudyPlanner}
    >
      <div className="w-5 h-5 flex items-center justify-center text-slate-500 group-hover:text-indigo-600">
        <Icon name="fa-calendar" className="text-sm" />
      </div>
      <span className="text-sm font-medium">{t('mobile_menu.study_plan')}</span>
    </DropdownMenuItem>

    <DropdownMenuItem
      className="flex items-center gap-3 px-4 py-3 w-full text-left cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors duration-200"
      onClick={onSettings}
    >
      <div className="w-5 h-5 flex items-center justify-center text-slate-500 group-hover:text-indigo-600">
        <Icon name="fa-cog" className="text-sm" />
      </div>
      <span className="text-sm font-medium">{t('modals.settings.tab_settings')}</span>
    </DropdownMenuItem>

    <DropdownMenuItem
      className="flex items-center gap-3 px-4 py-3 w-full text-left cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors duration-200"
      onClick={onCertificates}
    >
      <div className="w-5 h-5 flex items-center justify-center text-slate-500 group-hover:text-indigo-600">
        <Icon name="fa-medal" className="text-sm" />
      </div>
      <span className="text-sm font-medium">{t('mobile_menu.certificates')}</span>
    </DropdownMenuItem>

    <DropdownMenuItem
      className="flex items-center gap-3 px-4 py-3 w-full text-left cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors duration-200"
      onClick={onChangePassword}
    >
      <div className="w-5 h-5 flex items-center justify-center text-slate-500 group-hover:text-indigo-600">
        <Icon name="fa-key" className="text-sm" />
      </div>
      <span className="text-sm font-medium">{t('mobile_menu.change_password')}</span>
    </DropdownMenuItem>
  </DropdownMenuGroup>
);

export default UserMenuItems;
