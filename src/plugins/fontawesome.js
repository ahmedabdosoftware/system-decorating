// src/plugins/fontawesome.js
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faLock, faPrint, faHouse, faStore, faBriefcase, faSignOutAlt, faArrowRight, faFolder, faComments, faAdjust, faUserCircle, faChevronRight, faChevronLeft, faChevronDown,faChevronUp, faMoon, faSun, faTools, faUserTie, faProjectDiagram, faImage, faStickyNote, faBoxOpen, faTags, faUserSlash, faExclamationCircle, faEye, faEdit, faTrash, faFileInvoice,faFileInvoiceDollar, faShoppingCart, faClipboardList, faDollarSign, faCashRegister,faBalanceScale } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faUser, faLock, faPrint, faHouse, faStore, faBriefcase, faSignOutAlt, faArrowRight, faFolder, faComments, faAdjust, faUserCircle, faChevronRight, faChevronLeft, faChevronDown,faChevronUp, faMoon, faSun, faTools, faUserTie, faProjectDiagram, faImage, faStickyNote, faBoxOpen, faTags, faUserSlash, faExclamationCircle, faEye, faEdit, faTrash, faFileInvoice,faWhatsapp, faFileInvoiceDollar, faShoppingCart, faClipboardList, faDollarSign, faCashRegister,faBalanceScale)

export default FontAwesomeIcon;