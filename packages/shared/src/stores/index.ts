// ==========================================
// STORES INDEX - Export all stores
// ==========================================

// Cart Store
export {
  useCartStore,
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
  selectCartIsEmpty,
  selectCartIsHydrated,
  selectCartItem,
  selectItemQty,
  useCartItems,
  useCartTotalItems,
  useCartTotalPrice,
  useCartIsEmpty,
  useCartHydrated,
  useCartItem,
  useItemQty,
  useCartActions,
  type CartItem,
} from './cart-store';

// UI Store
export {
  useUIStore,
  selectSidebarOpen,
  selectSidebarCollapsed,
  selectMobileMenuOpen,
  selectModal,
  selectModalOpen,
  selectModalType,
  selectModalData,
  selectGlobalLoading,
  selectLoadingMessage,
  useSidebarOpen,
  useSidebarCollapsed,
  useMobileMenuOpen,
  useModal,
  useModalOpen,
  useModalType,
  useModalData,
  useGlobalLoading,
  useLoadingMessage,
  MODAL_TYPES,
  type ModalType,
} from './ui-store';