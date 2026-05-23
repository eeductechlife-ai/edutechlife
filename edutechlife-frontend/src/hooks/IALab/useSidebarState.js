import { useState, useEffect, useCallback, useRef } from 'react';
import { useIALabStore } from '../../store/ialabStore';
import { SECTION_DATA, MODULE_DATA, COURSE_DATA } from '../../components/IALab/constants/sidebarData';

const MOBILE_BREAKPOINT = 1024;

export function useSidebarState(initialState = { videos: true, recursos: false }) {
  const getSidebarState = useIALabStore(s => s.getSidebarState);
  const setSidebarState = useIALabStore(s => s.setSidebarState);
  const removeSidebarState = useIALabStore(s => s.removeSidebarState);
  const persistedState = getSidebarState(null);
  const [collapsedSections, setCollapsedSections] = useState(
    persistedState || initialState
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const initialRef = useRef(initialState);
  const debounceRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const mobile = window.innerWidth < MOBILE_BREAKPOINT;
        setIsMobile(mobile);
        if (mobile) setIsCollapsed(true);
      }, 100);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const persist = useCallback((state) => {
    setSidebarState(state);
  }, [setSidebarState]);

  const toggleSection = useCallback((name) => {
    setCollapsedSections(prev => {
      const next = { ...prev, [name]: !prev[name] };
      persist(next);
      return next;
    });
  }, [persist]);

  const expandAll = useCallback(() => {
    setCollapsedSections(prev => {
      const next = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      persist(next);
      return next;
    });
  }, [persist]);

  const collapseAll = useCallback(() => {
    setCollapsedSections(prev => {
      const next = Object.keys(prev).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      persist(next);
      return next;
    });
  }, [persist]);

  const isSectionCollapsed = useCallback((name) => {
    return collapsedSections[name] || false;
  }, [collapsedSections]);

  const reset = useCallback(() => {
    setCollapsedSections(initialRef.current);
    removeSidebarState();
  }, [removeSidebarState]);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const getSectionData = useCallback((sectionId) => {
    return SECTION_DATA[sectionId] || null;
  }, []);

  const getModuleData = useCallback(() => {
    return MODULE_DATA;
  }, []);

  const getCourseData = useCallback(() => {
    return COURSE_DATA;
  }, []);

  const getProgress = useCallback(() => {
    const total = MODULE_DATA.reduce((sum, mod) => sum + mod.progress, 0);
    return Math.round(total / MODULE_DATA.length);
  }, []);

  const getCompletedModules = useCallback(() => {
    return MODULE_DATA.filter(mod => mod.progress >= 100).map(mod => mod.id);
  }, []);

  const isModuleLocked = useCallback((moduleId) => {
    const mod = MODULE_DATA.find(m => m.id === moduleId);
    return mod ? mod.locked : true;
  }, []);

  return {
    collapsedSections,
    toggleSection,
    expandAll,
    collapseAll,
    isSectionCollapsed,
    reset,
    isMobile,
    isCollapsed,
    toggleSidebar,
    getSectionData,
    getModuleData,
    getCourseData,
    getProgress,
    getCompletedModules,
    isModuleLocked,
  };
}
