
import  { FC, Fragment, useContext, useEffect } from 'react'
import { connect } from 'react-redux';
import Themeprimarycolor, * as switcherdata from '../../ui/data/switcherdata/switcherdata';
import { ThemeChanger } from '../../../redux/action';
import SpkButton from '../../../@spk/uielements/spk-button';
import SpkOverlay from '../../../@spk/uielements/spk-overlay';
import { Initialload } from '../contextapi';

interface SwitcherProps { }

const Switcher: FC<SwitcherProps> = ({ local_variable, ThemeChanger }: any) => {
  
  const theme :any= useContext(Initialload);

  useEffect(() => {
    switcherdata.LocalStorageBackup(ThemeChanger, theme.setpageloading);

  }, []);


  return (
    <Fragment>
        <div id="hs-overlay-switcher" className="hs-overlay hidden ti-offcanvas ti-offcanvas-right">
          <div className="ti-offcanvas-header z-10 relative">
            <h5 className="ti-offcanvas-title !text-[1.25rem]">
              Personnalisation
            </h5>
            <SpkButton buttontype="button"
              customClass="ti-btn flex-shrink-0 p-0  transition-none text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-gray-700 focus:ring-gray-400 focus:ring-offset-white  dark:hover:text-white/80 dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
              Overlay="#hs-overlay-switcher">
              <span className="sr-only">Fermer</span>
              <i className="ri-close-circle-line leading-none text-lg"></i>
            </SpkButton>
          </div>
          <div className="ti-offcanvas-body !p-0 !border-b dark:border-white/10 z-10 relative !h-auto">
            <div className="flex rtl:space-x-reverse" aria-label="Tabs" role="tablist">
              <SpkButton buttontype="button"
                customClass="hs-tab-active:bg-success/20 w-full !py-2 !px-4 hs-tab-active:border-b-transparent text-defaultsize border-0 hs-tab-active:text-success dark:hs-tab-active:bg-success/20 dark:hs-tab-active:border-b-white/10 dark:hs-tab-active:text-success -mb-px bg-white font-semibold text-center  text-defaulttextcolor dark:text-defaulttextcolor/70 rounded-none hover:text-gray-700 dark:bg-bodybg dark:border-white/10  active"
                Id="switcher-item-1" Tab="#switcher-1" Controls="switcher-1" role="tab">
                Style du thème
              </SpkButton>
              <SpkButton buttontype="button"
                customClass="hs-tab-active:bg-success/20 w-full !py-2 !px-4 hs-tab-active:border-b-transparent text-defaultsize border-0 hs-tab-active:text-success dark:hs-tab-active:bg-success/20 dark:hs-tab-active:border-b-white/10 dark:hs-tab-active:text-success -mb-px  bg-white font-semibold text-center  text-defaulttextcolor dark:text-defaulttextcolor/70 rounded-none hover:text-gray-700 dark:bg-bodybg dark:border-white/10  dark:hover:text-gray-300"
                Id="switcher-item-2" Tab="#switcher-2" Controls="switcher-2" role="tab">
                Couleurs du thème
              </SpkButton>
            </div>
          </div>
          <div className="ti-offcanvas-body !px-0" id="switcher-body">
            <div id="switcher-1" role="tabpanel" aria-labelledby="switcher-item-1" className="">
              <div className="">
                <p className="switcher-style-head">Mode de couleur du thème :</p>
                <div className="grid grid-cols-3 switcher-style">
                  <div className="flex items-center">
                    <input type="radio" name="theme-style" className="ti-form-radio" id="switcher-light-theme" checked={local_variable.class != "dark"} onChange={_e => { }}
                      onClick={() => switcherdata.Light(ThemeChanger) } />
                    <label htmlFor="switcher-light-theme"
                      className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Clair</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" name="theme-style" className="ti-form-radio" id="switcher-dark-theme" checked={local_variable.class == "dark"} onChange={_e => { }}
                      onClick={() => switcherdata.Dark(ThemeChanger) } />
                    <label htmlFor="switcher-dark-theme"
                      className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Sombre</label>
                  </div>
                </div>
              </div>
              <div>
                <p className="switcher-style-head">Direction :</p>
                <div className="grid grid-cols-3  switcher-style">
                  <div className="flex items-center">
                    <input type="radio" name="direction" className="ti-form-radio" id="switcher-ltr" checked={local_variable.dir == "ltr"} onChange={_e => { }}
                      onClick={() =>  switcherdata.Ltr(ThemeChanger)} />
                    <label htmlFor="switcher-ltr" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">LTR</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" name="direction" className="ti-form-radio" id="switcher-rtl" checked={local_variable.dir == "rtl"} onChange={_e => { }}
                      onClick={() => switcherdata.Rtl(ThemeChanger)} />
                    <label htmlFor="switcher-rtl" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">RTL</label>
                  </div>
                </div>
              </div>
              <div>
                <p className="switcher-style-head">Styles de navigation :</p>
                <div className="grid grid-cols-3  switcher-style">
                  <div className="flex items-center">
                    <input type="radio" name="navigation-style" className="ti-form-radio" id="switcher-vertical" checked={local_variable.dataNavLayout == "vertical"} onChange={_e => { }}
                      onClick={() => switcherdata.Vertical(ThemeChanger)} />
                    <label htmlFor="switcher-vertical"
                      className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Verticale</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" name="navigation-style" className="ti-form-radio" id="switcher-horizontal" checked={local_variable.dataNavLayout == "horizontal"} onChange={_e => { }}
                      onClick={() => switcherdata.HorizontalClick(ThemeChanger)} />
                    <label htmlFor="switcher-horizontal"
                      className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Horizontale</label>
                  </div>
                </div>
              </div>
              <div>
                <p className="switcher-style-head">Style du menu de navigation :</p>
                <div className="grid grid-cols-2 gap-2 switcher-style">
                  <div className="flex">
                    <input type="radio" name="navigation-data-menu-styles" className="ti-form-radio" id="switcher-menu-click"
                      checked={local_variable.dataNavStyle == "menu-click"} onChange={_e => { }}
                      onClick={() => switcherdata.Menuclick(ThemeChanger)} />
                    <label htmlFor="switcher-menu-click" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Menu
                      (clic)</label>
                  </div>
                  <div className="flex">
                    <input type="radio" name="navigation-data-menu-styles" className="ti-form-radio" id="switcher-menu-hover" checked={local_variable.dataNavStyle == "menu-hover"} onChange={_e => { }}
                      onClick={() => switcherdata.MenuHover(ThemeChanger)} />
                    <label htmlFor="switcher-menu-hover" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Menu
                      (survol)</label>
                  </div>
                  <div className="flex">
                    <input type="radio" name="navigation-data-menu-styles" className="ti-form-radio" id="switcher-icon-click" checked={local_variable.dataNavStyle == "icon-click"} onChange={_e => { }}
                      onClick={() => switcherdata.IconClick(ThemeChanger)} />
                    <label htmlFor="switcher-icon-click" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Icon
                      (clic)</label>
                  </div>
                  <div className="flex">
                    <input type="radio" name="navigation-data-menu-styles" className="ti-form-radio" id="switcher-icon-hover" checked={local_variable.dataNavStyle == "icon-hover"} onChange={_e => { }}
                      onClick={() => switcherdata.IconHover(ThemeChanger)} />
                    <label htmlFor="switcher-icon-hover" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Icon
                      (survol)</label>
                  </div>
                </div>
                <div className="px-4 text-secondary text-xs"><b className="me-2">Note :</b>Fonctionne pareil en mode Vertical et
                  Horizontal.
                </div>
              </div>
              <div className=" sidemenu-layout-styles">
                <p className="switcher-style-head">Disposition du menu latéral :</p>
                <div className="grid grid-cols-2 gap-2 switcher-style">
                  <div className="flex">
                    <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-default-menu" defaultChecked
                      onClick={() => switcherdata.Defaultmenu(ThemeChanger) } />
                    <label htmlFor="switcher-default-menu"
                      className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">Menu
                      par défaut</label>
                  </div>
                  <div className="flex">
                    <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-closed-menu" checked={local_variable.dataToggled == "close-menu-close"} onChange={_e => { }}
                      onClick={() => switcherdata.Closedmenu(ThemeChanger)} />
                    <label htmlFor="switcher-closed-menu" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">
                      Menu
                      fermé</label>
                  </div>
                  <div className="flex">
                    <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-icontext-menu" checked={local_variable.dataToggled == "icon-text-close"} onChange={(_e) => { }}
                      onClick={() => switcherdata.iconText(ThemeChanger)} />
                    <label htmlFor="switcher-icontext-menu" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">Icon
                      + texte</label>
                  </div>
                  <div className="flex">
                    <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-icon-overlay" 
                      onClick={() => switcherdata.iconOverayFn(ThemeChanger)} />
                    <label htmlFor="switcher-icon-overlay" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">Superposition d’icônes</label>
                  </div>
                  <div className="flex">
                    <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-detached" checked={local_variable.dataToggled == "detached-close"} onChange={(_e) => { }}
                      onClick={() => switcherdata.DetachedFn(ThemeChanger)}/>
                    <label htmlFor="switcher-detached"
                      className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold ">Détaché</label>
                  </div>
                  <div className="flex">
                    <input type="radio" name="sidemenu-layout-styles" className="ti-form-radio" id="switcher-double-menu" checked={local_variable.dataVerticalStyle == "doublemenu"} onChange={(_e) => { }}
                      onClick={() => switcherdata.DoubletFn(ThemeChanger)}  />
                    <label htmlFor="switcher-double-menu" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Double
                      menu</label>
                  </div>
                </div>
                <div className="px-4 text-secondary text-xs"><b className="me-2">Note :</b>Les styles du menu de navigation ne fonctionnent pas ici.</div>
              </div>
              <div>
                <p className="switcher-style-head">Styles de page :</p>
                <div className="grid grid-cols-3  switcher-style">
                  <div className="flex">
                    <input type="radio" name="data-page-styles" className="ti-form-radio" id="switcher-regular" checked={local_variable.dataPageStyle == "regular"} onChange={_e => { }}
                      onClick={() => switcherdata.Regular(ThemeChanger)} />
                    <label htmlFor="switcher-regular"
                      className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Standard</label>
                  </div>
                  <div className="flex">
                    <input type="radio" name="data-page-styles" className="ti-form-radio" id="switcher-classic" checked={local_variable.dataPageStyle == "classic"} onChange={_e => { }}
                      onClick={() => switcherdata.Classic(ThemeChanger)} />
                    <label htmlFor="switcher-classic"
                      className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Classic</label>
                  </div>
                  <div className="flex">
                    <input type="radio" name="data-page-styles" className="ti-form-radio" id="switcher-modern" checked={local_variable.dataPageStyle == "modern"} onChange={_e => { }} 
                    onClick={() => switcherdata.Modern(ThemeChanger)} />
                    <label htmlFor="switcher-modern"
                      className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold"> Moderne</label>
                  </div>
                </div>
              </div>
              <div>
                <p className="switcher-style-head">Largeur de la mise en page :</p>
                <div className="grid grid-cols-3 switcher-style">
                  <div className="flex">
                    <input type="radio" name="layout-width" className="ti-form-radio" id="switcher-full-width" checked={local_variable.dataWidth == "fullwidth"} onChange={_e => { }}
                      onClick={() => switcherdata.Fullwidth(ThemeChanger)} />
                    <label htmlFor="switcher-full-width"
                      className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Pleine largeur</label>
                  </div>
                  <div className="flex">
                    <input type="radio" name="layout-width" className="ti-form-radio" id="switcher-boxed" checked={local_variable.dataWidth == "boxed"} onChange={_e => { }}
                      onClick={() => switcherdata.Boxed(ThemeChanger)} />
                    <label htmlFor="switcher-boxed" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Encadrée</label>
                  </div>
                </div>
              </div>
              <div>
                <p className="switcher-style-head">Position du menu :</p>
                <div className="grid grid-cols-3  switcher-style">
                  <div className="flex">
                    <input type="radio" name="data-menu-positions" className="ti-form-radio" id="switcher-menu-fixed" checked={local_variable.dataMenuPosition == "fixed"} onChange={_e => { }}
                      onClick={() => switcherdata.FixedMenu(ThemeChanger)} />
                    <label htmlFor="switcher-menu-fixed"
                      className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Fixe</label>
                  </div>
                  <div className="flex">
                    <input type="radio" name="data-menu-positions" className="ti-form-radio" id="switcher-menu-scroll" checked={local_variable.dataMenuPosition == "scrollable"} onChange={_e => { }}
                      onClick={() => switcherdata.scrollMenu(ThemeChanger)} />
                    <label htmlFor="switcher-menu-scroll"
                      className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Défilable </label>
                  </div>
                </div>
              </div>
              <div>
                <p className="switcher-style-head">Position de l’en-tête :</p>
                <div className="grid grid-cols-3 switcher-style">
                  <div className="flex">
                    <input type="radio" name="data-header-positions" className="ti-form-radio" id="switcher-header-fixed" checked={local_variable.dataHeaderPosition == "fixed"} onChange={_e => { }}
                      onClick={() => switcherdata.Headerpostionfixed(ThemeChanger)} />
                    <label htmlFor="switcher-header-fixed" className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">
                      Fixe</label>
                  </div>
                  <div className="flex">
                    <input type="radio" name="data-header-positions" className="ti-form-radio" id="switcher-header-scroll" checked={local_variable.dataHeaderPosition == "scrollable"} onChange={_e => { }}
                      onClick={() => switcherdata.Headerpostionscroll(ThemeChanger)} />
                    <label htmlFor="switcher-header-scroll"
                      className="text-defaultsize text-defaulttextcolor dark:text-defaulttextcolor/70 ms-2  font-semibold">Défilable
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div id="switcher-2" className="hidden" role="tabpanel" aria-labelledby="switcher-item-2">
              <div className="theme-colors">
                <p className="switcher-style-head">Couleurs du menu :</p>
                <div className="flex switcher-style space-x-3 rtl:space-x-reverse">
                  <SpkOverlay customClass="ti-form-radio switch-select ">
                    <input className="hs-tooltip-toggle ti-form-radio color-input color-white" type="radio" name="menu-colors"
                    checked={local_variable.dataMenuStyles == "light"} onChange={_e => { }}
                      id="switcher-menu-light" onClick={() => switcherdata.lightMenu(ThemeChanger)} />
                    <span
                      className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                      role="tooltip">
                      Menu clair
                    </span>
                  </SpkOverlay>
                  <SpkOverlay customClass="ti-form-radio switch-select ">
                    <input className="hs-tooltip-toggle ti-form-radio color-input color-dark" type="radio" name="menu-colors"
                    checked={local_variable.dataMenuStyles == "dark"} onChange={_e => { }}
                      id="switcher-menu-dark" onClick={() => switcherdata.darkMenu(ThemeChanger)} />
                    <span
                      className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                      role="tooltip">
                      Menu sombre
                    </span>
                  </SpkOverlay>
                  <SpkOverlay customClass="ti-form-radio switch-select ">
                    <input className="hs-tooltip-toggle ti-form-radio color-input color-primary" type="radio" name="menu-colors"
                    checked={local_variable.dataMenuStyles == "color"} onChange={_e => { }}
                      id="switcher-menu-primary" onClick={() => switcherdata.colorMenu(ThemeChanger)} />
                    <span
                      className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                      role="tooltip">
                      Menu coloré
                    </span>
                  </SpkOverlay>
                  <SpkOverlay customClass="ti-form-radio switch-select ">
                    <input className="hs-tooltip-toggle ti-form-radio color-input color-gradient" type="radio" name="menu-colors"
                    checked={local_variable.dataMenuStyles == "gradient"} onChange={_e => { }}
                      id="switcher-menu-gradient" onClick={() => switcherdata.gradientMenu(ThemeChanger)} />
                    <span
                      className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                      role="tooltip">
                      Menu dégradé
                    </span>
                  </SpkOverlay>
                  <SpkOverlay customClass="ti-form-radio switch-select ">
                    <input className="hs-tooltip-toggle ti-form-radio color-input color-transparent" type="radio" name="menu-colors"
                    checked={local_variable.dataMenuStyles == "transparent"} onChange={_e => { }}
                      id="switcher-menu-transparent" onClick={() => switcherdata.transparentMenu(ThemeChanger)} />
                    <span
                      className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                      role="tooltip">
                      Menu transparent
                    </span>
                  </SpkOverlay>
                </div>
                <div className="px-4 text-[#8c9097] dark:text-white/50 text-[.6875rem]"><b className="me-2">Note :</b>Pour changer la couleur du menu dynamiquement,
                  utilisez le sélecteur de couleur principale ci-dessous.</div>
              </div>
              <div className="theme-colors">
                <p className="switcher-style-head">Couleurs de l’en-tête :</p>
                <div className="flex switcher-style space-x-3 rtl:space-x-reverse">
                  <SpkOverlay customClass="ti-form-radio switch-select ">
                    <input className="hs-tooltip-toggle ti-form-radio color-input color-white !border" type="radio" name="header-colors"
                     checked={local_variable.dataHeaderStyles == "light"} onChange={_e => { }}
                      id="switcher-header-light" onClick={() => switcherdata.lightHeader(ThemeChanger)} />
                    <span
                      className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                      role="tooltip">
                      En-tête clair
                    </span>
                  </SpkOverlay>
                  <SpkOverlay customClass="ti-form-radio switch-select ">
                    <input className="hs-tooltip-toggle ti-form-radio color-input color-dark" type="radio" name="header-colors"
                     checked={local_variable.dataHeaderStyles == "dark"} onChange={_e => { }}
                      id="switcher-header-dark" onClick={() => switcherdata.darkHeader(ThemeChanger)} />
                    <span
                      className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                      role="tooltip">
                      En-tête sombre
                    </span>
                  </SpkOverlay>
                  <SpkOverlay customClass="ti-form-radio switch-select ">
                    <input className="hs-tooltip-toggle ti-form-radio color-input color-primary" type="radio" name="header-colors"
                     checked={local_variable.dataHeaderStyles == "color"} onChange={_e => { }}
                      id="switcher-header-primary" onClick={() => switcherdata.colorHeader(ThemeChanger)} />
                    <span
                      className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                      role="tooltip">
                      En-tête coloré
                    </span>
                  </SpkOverlay>
                  <SpkOverlay customClass="ti-form-radio switch-select ">
                    <input className="hs-tooltip-toggle ti-form-radio color-input color-gradient" type="radio" name="header-colors"
                     checked={local_variable.dataHeaderStyles == "gradient"} onChange={_e => { }}
                      id="switcher-header-gradient" onClick={() => switcherdata.gradientHeader(ThemeChanger)} />
                    <span
                      className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                      role="tooltip">
                      En-tête dégradé
                    </span>
                  </SpkOverlay>
                  <SpkOverlay customClass="ti-form-radio switch-select ">
                    <input className="hs-tooltip-toggle ti-form-radio color-input color-transparent" type="radio"
                      name="header-colors" id="switcher-header-transparent"  checked={local_variable.dataHeaderStyles == "transparent"} onChange={_e => { }} 
                      onClick={() => switcherdata.transparentHeader(ThemeChanger)} />
                    <span
                      className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black text-xs font-medium !text-white shadow-sm dark:!bg-black"
                      role="tooltip">
                      En-tête transparent
                    </span>
                  </SpkOverlay>
                </div>
                <div className="px-4 text-[#8c9097] dark:text-white/50 text-[.6875rem]"><b className="me-2">Note :</b>Pour changer la couleur de l’en-tête dynamiquement,
                  utilisez le sélecteur de couleur principale ci-dessous.</div>
              </div>
              <div className="theme-colors">
                <p className="switcher-style-head">Couleur principale :</p>
                <div className="flex flex-wrap switcher-style gap-y-2 gap-x-5 rtl:gap-x-reverse">
                  <div className="ti-form-radio switch-select">
                    <input className="ti-form-radio color-input color-primary-1" type="radio" name="theme-primary"
                    checked={local_variable.colorPrimaryRgb == '58, 88, 146'} onChange={(_e) => { }}
                      id="switcher-primary" onClick={() => switcherdata.primaryColor1(ThemeChanger)} />
                  </div>
                  <div className="ti-form-radio switch-select">
                    <input className="ti-form-radio color-input color-primary-2" type="radio" name="theme-primary"
                    checked={local_variable.colorPrimaryRgb == '92, 144 ,163'} onChange={(_e) => { }}
                      id="switcher-primary1" onClick={() => switcherdata.primaryColor2(ThemeChanger)} />
                  </div>
                  <div className="ti-form-radio switch-select">
                    <input className="ti-form-radio color-input color-primary-3" type="radio" name="theme-primary"
                     checked={local_variable.colorPrimaryRgb == '161, 90 ,223'} onChange={(_e) => { }}
                      id="switcher-primary2" onClick={() => switcherdata.primaryColor3(ThemeChanger)} />
                  </div>
                  <div className="ti-form-radio switch-select">
                    <input className="ti-form-radio color-input color-primary-4" type="radio" name="theme-primary"
                    checked={local_variable.colorPrimaryRgb == '78, 172, 76'} onChange={(_e) => { }}
                      id="switcher-primary3" onClick={() => switcherdata.primaryColor4(ThemeChanger)} />
                  </div>
                  <div className="ti-form-radio switch-select">
                    <input className="ti-form-radio color-input color-primary-5" type="radio" name="theme-primary"
                    checked={local_variable.colorPrimaryRgb == '223, 90, 90'} onChange={(_e) => { }}
                      id="switcher-primary4" onClick={() => switcherdata.primaryColor5(ThemeChanger)} />
                  </div>
                  <div className="ti-form-radio switch-select ps-0 mt-1 color-primary-light">
                  <div className='theme-container-primary'>
                    <SpkButton customClass="">nano</SpkButton>
                  </div>
                  <div className='pickr-container-primary'>
                    <div className='pickr'>
                      <SpkButton customClass='pcr-button' onclickfunc={(ele: any) => {
                        if (ele.target.querySelector("input")) {
                          ele.target.querySelector("input").click();
                        }
                      }}>
                        <Themeprimarycolor theme={local_variable} actionfunction={ThemeChanger} />
                      </SpkButton>

                    </div>
                  </div>
                </div>
                </div>
              </div>
              <div className="theme-colors">
                <p className="switcher-style-head">Arrière-plan du thème :</p>
                <div className="flex flex-wrap switcher-style gap-y-2 gap-x-5 rtl:gap-x-reverse">
                  <div className="ti-form-radio switch-select">
                    <input className="ti-form-radio color-input color-bg-1" type="radio" name="theme-background"
                    checked={local_variable.bodyBg == '34 44 110'} onChange={(_e) => { }}
                      id="switcher-background" onClick={() =>  switcherdata.backgroundColor1(ThemeChanger)} />
                  </div>
                  <div className="ti-form-radio switch-select">
                    <input className="ti-form-radio color-input color-bg-2" type="radio" name="theme-background"
                    checked={local_variable.bodyBg == '22 92 129'} onChange={(_e) => { }}
                      id="switcher-background1" onClick={() =>  switcherdata.backgroundColor2(ThemeChanger)} />
                  </div>
                  <div className="ti-form-radio switch-select">
                    <input className="ti-form-radio color-input color-bg-3" type="radio" name="theme-background"
                    checked={local_variable.bodyBg == '104 51 149'} onChange={(_e) => { }}
                      id="switcher-background2" onClick={() =>  switcherdata.backgroundColor3(ThemeChanger)} />
                  </div>
                  <div className="ti-form-radio switch-select">
                    <input className="ti-form-radio color-input color-bg-4" type="radio" name="theme-background"
                    checked={local_variable.bodyBg == '29 106 56'} onChange={(_e) => { }}
                      id="switcher-background3" onClick={() =>  switcherdata.backgroundColor4(ThemeChanger)} />
                  </div>
                  <div className="ti-form-radio switch-select">
                    <input className="ti-form-radio color-input color-bg-5" type="radio" name="theme-background"
                    checked={local_variable.bodyBg == '134 80 34'} onChange={(_e) => { }}
                      id="switcher-background4" onClick={() =>  switcherdata.backgroundColor5(ThemeChanger)} />
                  </div>
                  <div className="ti-form-radio switch-select ps-0 mt-1 color-bg-transparent">
                  <div className='theme-container-background' >
                    <SpkButton customClass="">nano</SpkButton>
                  </div>
                  <div className='pickr-container-background'>
                    <div className='pickr'>
                      <SpkButton customClass='pcr-button' onclickfunc={(ele: any) => {
                        if (ele.target.querySelector("input")) {
                          ele.target.querySelector("input").click();
                        }
                      }}>
                        <switcherdata.Themebackgroundcolor theme={local_variable} actionfunction={ThemeChanger} />
                      </SpkButton>

                    </div>
                  </div>
                </div>
                </div>
              </div>
              <div className="menu-image theme-colors">
                <p className="switcher-style-head">Menu avec image d’arrière-plan :</p>
                <div className="flex switcher-style space-x-3 rtl:space-x-reverse flex-wrap gap-3">
                  <div className="ti-form-radio switch-select">
                    <input className="ti-form-radio bgimage-input bg-img1" type="radio" name="theme-images" id="switcher-bg-img" onClick={() =>  switcherdata.bgImage1(ThemeChanger)}  checked={local_variable.colorPrimaryRgb == 'bg-img'} onChange={(_e) => { }}/>
                  </div>
                  <div className="ti-form-radio switch-select">
                    <input className="ti-form-radio bgimage-input bg-img2" type="radio" name="theme-images" id="switcher-bg-img1" onClick={() =>  switcherdata.bgImage2(ThemeChanger)} checked={local_variable.colorPrimaryRgb == 'bg-img1'} onChange={(_e) => { }}/>
                  </div>
                  <div className="ti-form-radio switch-select">
                    <input className="ti-form-radio bgimage-input bg-img3" type="radio" name="theme-images" id="switcher-bg-img2" onClick={() =>  switcherdata.bgImage3(ThemeChanger)} checked={local_variable.colorPrimaryRgb == 'bg-img2'} onChange={(_e) => { }}/>
                  </div>
                  <div className="ti-form-radio switch-select">
                    <input className="ti-form-radio bgimage-input bg-img4" type="radio" name="theme-images" id="switcher-bg-img3" onClick={() => switcherdata.bgImage4(ThemeChanger)} checked={local_variable.colorPrimaryRgb == 'bg-img3'} onChange={(_e) => { }}/>
                  </div>
                  <div className="ti-form-radio switch-select">
                    <input className="ti-form-radio bgimage-input bg-img5" type="radio" name="theme-images" id="switcher-bg-img4" onClick={() =>  switcherdata.bgImage5(ThemeChanger)} checked={local_variable.colorPrimaryRgb == 'bg-img4'} onChange={(_e) => { }}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ti-offcanvas-footer sm:flex justify-between"> 
              <a href="#"onClick={() => switcherdata.Reset(ThemeChanger)} id="reset-all" className="w-full ti-btn ti-btn-danger-full m-1">Réinitialiser</a> 
          </div>
        </div>
    </Fragment>
  )
}

const mapStateToProps = (state: any) => ({
  local_variable: state
})

export default connect(mapStateToProps, { ThemeChanger })(Switcher);