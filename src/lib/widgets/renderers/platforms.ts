import { esc } from "../base";
import { BRAND_PATHS, brandSvg } from "./kit";
import type { RenderResult, WidgetConfig } from "../types";

/* Platforms — 50 branded widgets (auth pages, social posts, chat, players,
   work tools, commerce) using real brand marks and each platform's palette,
   rebuilt compactly in PlanckUi's design language. All interactive. */

type PR = (c: WidgetConfig) => RenderResult;

const PL_CSS = `
.pf-auth, .pf-mini, .pfl-post {
  --b-card: #ffffff; --b-ink: #17181c; --b-mut: #6b7280;
  --b-line: #e5e7eb; --b-input: #f5f6f8;
}
:host(.dark) .pf-auth, :host(.dark) .pf-mini, :host(.dark) .pfl-post {
  --b-card: #16181d; --b-ink: #f2f4f7; --b-mut: #8b929c;
  --b-line: #2a2f38; --b-input: #101318;
}
:host(.dark) .pf-btn { box-shadow: inset 0 0 0 1px oklch(1 0 0 / 0.22); }
.pf-auth, .pf-mini { max-width: 380px; margin-inline: auto; border-radius: var(--w-radius, 18px);
  padding: 28px; border: 1px solid var(--b-line); background: var(--b-card); color: var(--b-ink);
  box-shadow: 0 22px 50px oklch(0 0 0 / 0.28);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
.pf-auth h3, .pf-mini h3 { margin: 0 0 4px; font-size: 20px; font-weight: 700; letter-spacing: -0.015em; }
.pf-sub { margin: 4px 0 16px; font-size: 13.5px; color: var(--b-mut); }
.pf-field { margin-bottom: 12px; }
.pf-field label { display: block; font-size: 12px; color: var(--b-mut); margin-bottom: 4px; }
.pf-field input { width: 100%; font: inherit; font-size: 14.5px; padding: 11px 13px;
  border: 1px solid var(--b-line); border-radius: 10px; background: var(--b-input, transparent); color: var(--b-ink); }
.pf-field input:focus { outline: 2px solid var(--b-accent); outline-offset: 1px; }
.pf-btn { width: 100%; font: inherit; font-size: 14.5px; font-weight: 600; padding: 12px;
  border: 0; border-radius: 10px; cursor: pointer; color: #fff;
  transition: filter 160ms ease, transform 160ms cubic-bezier(0.23,1,0.32,1); }
.pf-btn:hover { filter: brightness(1.08); }
.pf-btn:active { transform: scale(0.98); }
.pf-or { display: flex; align-items: center; gap: 12px; margin: 16px 0;
  font-size: 11px; color: var(--b-mut); text-transform: uppercase; letter-spacing: 0.08em; }
.pf-or::before, .pf-or::after { content: ""; flex: 1; height: 1px; background: var(--b-line); }
.pf-mark { width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center;
  margin: 0 auto 14px; }
.pf-foot { margin-top: 16px; font-size: 12px; color: var(--b-mut); text-align: center; }
.pf-soc { display: flex; gap: 8px; justify-content: center; margin: 14px 0 4px; }
.pf-soc button { width: 42px; height: 42px; border-radius: 999px; border: 1px solid var(--b-line);
  background: var(--b-input); color: var(--b-ink); cursor: pointer; display: grid; place-items: center;
  transition: transform 150ms cubic-bezier(0.23,1,0.32,1), border-color 150ms ease; }
.pf-soc button:hover { transform: translateY(-2px); border-color: var(--b-accent); }
.plk-post { max-width: 400px; margin-inline: auto; border-radius: 16px; overflow: hidden;
  border: 1px solid var(--b-line); background: var(--b-card); color: var(--b-ink);
  box-shadow: 0 16px 40px oklch(0 0 0 / 0.16); }
.pf-ava { width: 40px; height: 40px; border-radius: 999px; object-fit: cover; flex-shrink: 0;
  display: grid; place-items: center; font-weight: 700; color: #fff; font-size: 15px; }
.pf-acts { display: flex; gap: 18px; padding: 10px 14px; font-size: 13px; color: var(--b-mut); }
`;


/* real brand marks (simple-icons geometry), letter chip as fallback */
const MARKS: Record<string, string> = {
  microsoft:
    '<svg viewBox="0 0 23 23" width="20" height="20" aria-hidden="true"><rect x="1" y="1" width="10" height="10" fill="#f25022"/><rect x="12" y="1" width="10" height="10" fill="#7fba00"/><rect x="1" y="12" width="10" height="10" fill="#00a4ef"/><rect x="12" y="12" width="10" height="10" fill="#ffb900"/></svg>',
  gmail:
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#ea4335" d="M12 11.3 3.4 5.1h17.2L12 11.3z"/><path fill="#4285f4" d="M20.6 5.1v13.8h-3V9.4L12 13.2 6.4 9.4v9.5h-3V5.1h.01L12 11.3l8.6-6.2z"/></svg>',
  drive:
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#fbbc04" d="M8.6 2h6.8l6.5 11.3h-6.8z"/><path fill="#4285f4" d="M15.4 13.3h6.8L18.8 20l-3.4 2-6.8-11.3z" opacity="0.9"/><path fill="#34a853" d="M2 13.3 8.6 2l3.4 5.9-6.5 11.3z"/></svg>',
  gplay:
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#00daff" d="M3.6 1.8 14.9 12 3.6 22.2c-.4-.2-.6-.6-.6-1.1V2.9c0-.5.2-.9.6-1.1Z"/><path fill="#ffce00" d="M18.4 8.4 15 12l-3.1-3 .1-.1L15 5.5l3.4 2.9Z"/><path fill="#ff3a44" d="M3.6 22.2 14.9 12l3.4 3.4-11.9 6.9c-.6.3-1.2.3-1.6-.1Z"/><path fill="#00f076" d="M3.6 1.8c.3-.2.7-.2 1.1 0l11.9 6.6-3.5 3.6L3.6 1.8Z"/></svg>',
  gdocs:
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#4285f4" d="M6 2h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path fill="#a8c7fa" d="M14 2l5 5h-5V2z"/><path fill="#fff" d="M8 12h8v1.4H8V12zm0 3h8v1.4H8V15zm0 3h5.5v1.4H8V18z"/></svg>',
  figma:
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#F24E1E" d="M12 0H8a4 4 0 0 0 0 8h4V0z"/><path fill="#FF7262" d="M12 0h4a4 4 0 0 1 0 8h-4V0z"/><path fill="#A259FF" d="M12 8H8a4 4 0 0 0 0 8h4V8z"/><circle fill="#1ABCFE" cx="16" cy="12" r="4"/><path fill="#0ACF83" d="M4 20a4 4 0 0 1 4-4h4v4a4 4 0 0 1-8 0z"/></svg>',
  order: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  steam: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-10 8.6l5.3 2.2a2.9 2.9 0 0 1 1.6-.5l2.4-3.5V8.7a4.4 4.4 0 0 1 4.4 4.3 4.4 4.4 0 0 1-4.5 4.4L7.9 19a2.9 2.9 0 0 1-5.3-1L.1 15.5A10 10 0 0 0 12 22a10 10 0 0 0 0-20Z"/></svg>',
  slack:
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="#E01E5A" aria-hidden="true"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>',
  notion: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#000000" aria-hidden="true"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/></svg>',
  linear: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#5E6AD2" aria-hidden="true"><path d="M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z"/></svg>',
  stripe: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#635BFF" aria-hidden="true"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/></svg>',
  venmo: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#008CFF" aria-hidden="true"><path d="M21.772 13.119c-.267 0-.381-.251-.38-.655 0-.533.121-1.575.712-1.575.267 0 .357.243.357.598 0 .533-.13 1.632-.689 1.632Zm.502-3.377c-1.677 0-2.405 1.285-2.405 2.658 0 1.042.421 1.874 1.693 1.874 1.717 0 2.438-1.406 2.438-2.763 0-1.025-.462-1.769-1.726-1.769Zm-3.833 0c-.558 0-.964.17-1.393.477-.154-.275-.462-.477-.932-.477-.542 0-.947.219-1.247.437l-.04-.364H13.54l-.688 4.354h1.506l.479-3.053c.129-.065.323-.154.518-.154.145 0 .267.049.267.267 0 .056-.016.145-.024.218l-.429 2.722h1.498l.478-3.053c.138-.073.324-.154.51-.154.146 0 .268.049.268.267 0 .056-.017.145-.025.218l-.429 2.722h1.499l.461-2.908c.025-.153.049-.388.049-.549 0-.582-.267-.97-1.037-.97Zm-6.871 0c-.575 0-.98.219-1.287.421l-.017-.348H8.962l-.689 4.354H9.78l.478-3.053c.13-.065.324-.154.518-.154.147 0 .268.049.268.242 0 .081-.024.227-.032.299l-.422 2.666h1.499l.462-2.908c.024-.153.049-.388.049-.549 0-.582-.268-.97-1.03-.97Zm-5.631 1.834c.041-.485.413-.824.697-.824.162 0 .299.097.299.291 0 .404-.713.533-.996.533Zm.843-1.834c-1.604 0-2.382 1.39-2.382 2.698 0 1.01.478 1.817 1.814 1.817.527 0 1.07-.113 1.418-.282l.186-1.26c-.494.25-.874.347-1.271.347-.365 0-.64-.194-.64-.687.826-.008 2.252-.347 2.252-1.453 0-.687-.494-1.18-1.377-1.18Zm-4.239.267c.089.186.146.412.146.743 0 .606-.429 1.494-.777 2.06l-.373-2.989L0 9.969l.705 4.2h1.757c.77-1.01 1.718-2.448 1.718-3.554 0-.347-.073-.622-.235-.889l-1.402.283Z"/></svg>',
  messenger: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#0866FF" aria-hidden="true"><path d="M12 0C5.24 0 0 4.952 0 11.64c0 3.499 1.434 6.521 3.769 8.61a.96.96 0 0 1 .323.683l.065 2.135a.96.96 0 0 0 1.347.85l2.381-1.053a.96.96 0 0 1 .641-.046A13 13 0 0 0 12 23.28c6.76 0 12-4.952 12-11.64S18.76 0 12 0m6.806 7.44c.522-.03.971.567.63 1.094l-4.178 6.457a.707.707 0 0 1-.977.208l-3.87-2.504a.44.44 0 0 0-.49.007l-4.363 3.01c-.637.438-1.415-.317-.995-.966l4.179-6.457a.706.706 0 0 1 .977-.21l3.87 2.505c.15.097.344.094.491-.007l4.362-3.008a.7.7 0 0 1 .364-.13"/></svg>',
  telegram: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#26A5E4" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
  trello: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#0052CC" aria-hidden="true"><path d="M21.147 0H2.853A2.86 2.86 0 000 2.853v18.294A2.86 2.86 0 002.853 24h18.294A2.86 2.86 0 0024 21.147V2.853A2.86 2.86 0 0021.147 0zM10.34 17.287a.953.953 0 01-.953.953h-4a.954.954 0 01-.954-.953V5.38a.953.953 0 01.954-.953h4a.954.954 0 01.953.953zm9.233-5.467a.944.944 0 01-.953.947h-4a.947.947 0 01-.953-.947V5.38a.953.953 0 01.953-.953h4a.954.954 0 01.953.953z"/></svg>',
  dropbox: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#0061FF" aria-hidden="true"><path d="M6 1.807L0 5.629l6 3.822 6.001-3.822L6 1.807zM18 1.807l-6 3.822 6 3.822 6-3.822-6-3.822zM0 13.274l6 3.822 6.001-3.822L6 9.452l-6 3.822zM18 9.452l-6 3.822 6 3.822 6-3.822-6-3.822zM6 18.371l6.001 3.822 6-3.822-6-3.822L6 18.371z"/></svg>',
  shopify: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#7AB55C" aria-hidden="true"><path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z"/></svg>',
  airbnb: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#FF5A5F" aria-hidden="true"><path d="M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.188-1.056 2.121-1.056s1.643.345 2.12 1.063c.446.61.558 1.432.286 2.465-.291 1.298-1.085 2.785-2.412 4.458zm9.601 1.14c-.185 1.246-1.034 2.28-2.2 2.783-2.253.98-4.483-.583-6.392-2.704 3.157-3.951 3.74-7.028 2.385-9.018-.795-1.14-1.933-1.695-3.394-1.695-2.944 0-4.563 2.49-3.927 5.382.37 1.565 1.352 3.343 2.917 5.332-.98 1.085-1.91 1.856-2.732 2.333-.636.344-1.245.558-1.828.609-2.679.399-4.778-2.2-3.825-4.88.132-.345.395-.98.845-1.961l.025-.053c1.464-3.178 3.242-6.79 5.285-10.795l.053-.132.58-1.116c.45-.822.635-1.19 1.351-1.643.346-.21.77-.315 1.246-.315.954 0 1.698.558 2.016 1.007.158.239.345.557.582.953l.558 1.089.08.159c2.041 4.004 3.821 7.608 5.279 10.794l.026.025.533 1.22.318.764c.243.613.294 1.222.213 1.858zm1.22-2.39c-.186-.583-.505-1.271-.9-2.094v-.03c-1.889-4.006-3.642-7.608-5.307-10.844l-.111-.163C15.317 1.461 14.468 0 12.001 0c-2.44 0-3.476 1.695-4.535 3.898l-.081.16c-1.669 3.236-3.421 6.843-5.303 10.847v.053l-.559 1.22c-.21.504-.317.768-.345.847C-.172 20.74 2.611 24 5.98 24c.027 0 .132 0 .265-.027h.372c1.75-.213 3.554-1.325 5.384-3.317 1.829 1.989 3.635 3.104 5.382 3.317h.372c.133.027.239.027.265.027 3.37.003 6.152-3.261 4.802-6.975z"/></svg>',
  uber: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#ffffff" aria-hidden="true"><path d="M0 7.97v4.958c0 1.867 1.302 3.101 3 3.101.826 0 1.562-.316 2.094-.87v.736H6.27V7.97H5.082v4.888c0 1.257-.85 2.106-1.947 2.106-1.11 0-1.946-.827-1.946-2.106V7.971H0zm7.44 0v7.925h1.13v-.725c.521.532 1.257.86 2.06.86a3.006 3.006 0 0 0 3.034-3.01 3.01 3.01 0 0 0-3.033-3.024 2.86 2.86 0 0 0-2.049.861V7.971H7.439zm9.869 2.038c-1.687 0-2.965 1.37-2.965 3 0 1.72 1.334 3.01 3.066 3.01 1.053 0 1.913-.463 2.49-1.233l-.826-.611c-.43.577-.996.847-1.664.847-.973 0-1.753-.7-1.912-1.64h4.697v-.373c0-1.72-1.222-3-2.886-3zm6.295.068c-.634 0-1.098.294-1.381.758v-.713h-1.131v5.774h1.142V12.61c0-.894.544-1.47 1.291-1.47H24v-1.065h-.396zm-6.319.928c.85 0 1.564.588 1.756 1.47H15.52c.203-.882.916-1.47 1.765-1.47zm-6.732.012c1.086 0 1.98.883 1.98 2.004a1.993 1.993 0 0 1-1.98 2.001A1.989 1.989 0 0 1 8.56 13.02a1.99 1.99 0 0 1 1.992-2.004z"/></svg>',
  netflix: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#E50914" aria-hidden="true"><path d="m5.398 0 8.348 23.602c2.346.059 4.856.398 4.856.398L10.113 0H5.398zm8.489 0v9.172l4.715 13.33V0h-4.715zM5.398 1.5V24c1.873-.225 2.81-.312 4.715-.398V14.83L5.398 1.5z"/></svg>',
  zoom: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#0B5CFF" aria-hidden="true"><path d="M5.033 14.649H.743a.74.74 0 0 1-.686-.458.74.74 0 0 1 .16-.808L3.19 10.41H1.06A1.06 1.06 0 0 1 0 9.35h3.957c.301 0 .57.18.686.458a.74.74 0 0 1-.161.808L1.51 13.59h2.464c.585 0 1.06.475 1.06 1.06zM24 11.338c0-1.14-.927-2.066-2.066-2.066-.61 0-1.158.265-1.537.686a2.061 2.061 0 0 0-1.536-.686c-1.14 0-2.066.926-2.066 2.066v3.311a1.06 1.06 0 0 0 1.06-1.06v-2.251a1.004 1.004 0 0 1 2.013 0v2.251c0 .586.474 1.06 1.06 1.06v-3.311a1.004 1.004 0 0 1 2.012 0v2.251c0 .586.475 1.06 1.06 1.06zM16.265 12a2.728 2.728 0 1 1-5.457 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0zm-4.82 0a2.728 2.728 0 1 1-5.458 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0z"/></svg>',
  ph: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#DA552F" aria-hidden="true"><path d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.801 0-.993-.805-1.799-1.801-1.799zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.804c2.319 0 4.2 1.88 4.2 4.199 0 2.321-1.881 4.201-4.201 4.201z"/></svg>',
  paypal: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#002991" aria-hidden="true"><path d="M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86m6.57 5.546c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z"/></svg>',
  metamask: '<svg viewBox="0 0 318.6 318.6" width="20" height="20" aria-hidden="true"> <style> .st1,.st6{fill:#e4761b;stroke:#e4761b;stroke-linecap:round;stroke-linejoin:round}.st6{fill:#f6851b;stroke:#f6851b} </style> <path fill="#e2761b" stroke="#e2761b" stroke-linecap="round" stroke-linejoin="round" d="m274.1 35.5-99.5 73.9L193 65.8z"/> <path d="m44.4 35.5 98.7 74.6-17.5-44.3zm193.9 171.3-26.5 40.6 56.7 15.6 16.3-55.3zm-204.4.9L50.1 263l56.7-15.6-26.5-40.6z" class="st1"/> <path d="m103.6 138.2-15.8 23.9 56.3 2.5-2-60.5zm111.3 0-39-34.8-1.3 61.2 56.2-2.5zM106.8 247.4l33.8-16.5-29.2-22.8zm71.1-16.5 33.9 16.5-4.7-39.3z" class="st1"/> <path fill="#d7c1b3" stroke="#d7c1b3" stroke-linecap="round" stroke-linejoin="round" d="m211.8 247.4-33.9-16.5 2.7 22.1-.3 9.3zm-105 0 31.5 14.9-.2-9.3 2.5-22.1z"/> <path fill="#233447" stroke="#233447" stroke-linecap="round" stroke-linejoin="round" d="m138.8 193.5-28.2-8.3 19.9-9.1zm40.9 0 8.3-17.4 20 9.1z"/> <path fill="#cd6116" stroke="#cd6116" stroke-linecap="round" stroke-linejoin="round" d="m106.8 247.4 4.8-40.6-31.3.9zM207 206.8l4.8 40.6 26.5-39.7zm23.8-44.7-56.2 2.5 5.2 28.9 8.3-17.4 20 9.1zm-120.2 23.1 20-9.1 8.2 17.4 5.3-28.9-56.3-2.5z"/> <path fill="#e4751f" stroke="#e4751f" stroke-linecap="round" stroke-linejoin="round" d="m87.8 162.1 23.6 46-.8-22.9zm120.3 23.1-1 22.9 23.7-46zm-64-20.6-5.3 28.9 6.6 34.1 1.5-44.9zm30.5 0-2.7 18 1.2 45 6.7-34.1z"/> <path d="m179.8 193.5-6.7 34.1 4.8 3.3 29.2-22.8 1-22.9zm-69.2-8.3.8 22.9 29.2 22.8 4.8-3.3-6.6-34.1z" class="st6"/> <path fill="#c0ad9e" stroke="#c0ad9e" stroke-linecap="round" stroke-linejoin="round" d="m180.3 262.3.3-9.3-2.5-2.2h-37.7l-2.3 2.2.2 9.3-31.5-14.9 11 9 22.3 15.5h38.3l22.4-15.5 11-9z"/> <path fill="#161616" stroke="#161616" stroke-linecap="round" stroke-linejoin="round" d="m177.9 230.9-4.8-3.3h-27.7l-4.8 3.3-2.5 22.1 2.3-2.2h37.7l2.5 2.2z"/> <path fill="#763d16" stroke="#763d16" stroke-linecap="round" stroke-linejoin="round" d="m278.3 114.2 8.5-40.8-12.7-37.9-96.2 71.4 37 31.3 52.3 15.3 11.6-13.5-5-3.6 8-7.3-6.2-4.8 8-6.1zM31.8 73.4l8.5 40.8-5.4 4 8 6.1-6.1 4.8 8 7.3-5 3.6 11.5 13.5 52.3-15.3 37-31.3-96.2-71.4z"/> <path d="m267.2 153.5-52.3-15.3 15.9 23.9-23.7 46 31.2-.4h46.5zm-163.6-15.3-52.3 15.3-17.4 54.2h46.4l31.1.4-23.6-46zm71 26.4 3.3-57.7 15.2-41.1h-67.5l15 41.1 3.5 57.7 1.2 18.2.1 44.8h27.7l.2-44.8z" class="st6"/>',
};

function markFor(brand: string): string {
  if (BRAND_PATHS[brand] || brand === "google") return brandSvg(brand, 20) || "";
  const letter = brand.charAt(0).toUpperCase();
  return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect width="24" height="24" rx="6" fill="oklch(0.2 0.01 250)"/><text x="12" y="16.5" text-anchor="middle" font-family="ui-sans-serif,system-ui" font-size="12" font-weight="700" fill="#fff">' + esc(letter) + "</text></svg>";
}

const MARK_ALIAS: Record<string, string> = { ms: "microsoft", gdrive: "drive" };
function chipMark(brand: string, size = 22): string {
  const key = MARK_ALIAS[brand] || brand;
  return brandSvg(key, size) || MARKS[key] || markFor(key);
}

/* ---------------- auth factory ---------------- */

interface AuthOpts {
  accent: string; tone?: "light" | "dark"; card?: string; line?: string; input?: string;
  mark: string; chipBg?: string; title: string; sub: string; btn: string; btnBg: string;
  btnColor?: string; social?: string[]; pw?: boolean;
}
function authW(o: AuthOpts): PR {
  return (c) => {
    const accentVars = "--b-accent:" + o.accent + ";";
    const body =
      `<div class="pf-mark" style="background:${o.chipBg || "var(--b-input)"}">${o.mark}</div>` +
      `<h3>${esc(o.title)}</h3><p class="pf-sub">${esc(o.sub)}</p>` +
      `<form id="pf-f" novalidate>` +
      `<div class="pf-field"><label>Email</label><input name="email" type="email" required placeholder="you@example.com" autocomplete="email"></div>` +
      (o.pw === false ? "" : `<div class="pf-field"><label>Password</label><input name="pw" type="password" required placeholder="••••••••" autocomplete="current-password"></div>`) +
      `<button class="pf-btn" type="submit" style="background:${o.btnBg};color:${o.btnColor || "#fff"}">${esc(o.btn)}</button>` +
      `</form>` +
      (o.social && o.social.length
        ? `<div class="pf-or">or continue with</div><div class="pf-soc">` +
          o.social.map((b) => `<button type="button" title="${esc(b)}">${chipMark(b, 18)}</button>`).join("") +
          `</div>`
        : "") +
      `<p class="pf-foot">No credit card. No spam. Just paste it.</p>`;
    const js =
      "var f=shadow.getElementById('pf-f');" +
      "f.addEventListener('submit',function(e){e.preventDefault();" +
      "if(!f.checkValidity()){f.reportValidity();return}" +
      "var b=f.querySelector('.pf-btn');b.textContent='Signing in…';b.disabled=true;" +
      "setTimeout(function(){b.textContent='Welcome back ✓';b.disabled=false},900)});";
    return { html: '<div class="pf-auth" style="' + accentVars + '">' + body + "</div>", css: PL_CSS, js: undefined };
  };
}

/* compact mini-card factory (players / work / commerce / misc) */
interface MiniOpts {
  accent: string; tone?: "light" | "dark"; mark: string; chipBg?: string;
  title: string; sub: string; meta: string; btn?: string; btnBg?: string; bar?: number;
}
function miniW(o: MiniOpts): PR {
  return (c) => {
    const accentVars = "--b-accent:" + o.accent + ";";
    const body =
      `<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">` +
      `<span class="pf-mark" style="margin:0;background:${o.chipBg || "var(--b-accent)"}${o.chipBg ? "" : ";color:#fff"}">${o.mark}</span>` +
      `<div><b style="font-size:14.5px">${esc(o.title)}</b><div style="font-size:12px;color:var(--b-mut)">${esc(o.sub)}</div></div></div>` +
      (o.bar !== undefined ? `<div style="height:6px;border-radius:999px;background:var(--b-line);overflow:hidden"><div style="height:100%;width:${o.bar}%;background:var(--b-accent);border-radius:999px"></div></div>` : "") +
      `<div style="margin-top:12px;font-size:12px;color:var(--b-mut)">${esc(o.meta)}</div>` +
      (o.btn ? `<button class="pf-btn" type="button" style="margin-top:12px;background:${o.btnBg || "var(--b-accent)"}">${esc(o.btn)}</button>` : "");
    return { html: '<div class="pf-mini" style="' + accentVars + '">' + body + "</div>", css: PL_CSS };
  };
}

/* post factory */
function postW(o: { name: string; handle: string; chip: string; text: string; img?: string }): PR {
  return (c) => {
    const body =
      `<div style="display:flex;align-items:center;gap:10px;padding:14px 16px 0"><span class="pf-ava" style="background:${o.chip}">${esc(o.name.charAt(0))}</span>` +
      `<div><b style="font-size:14px;display:block">${esc(o.name)}</b><span style="font-size:12px;color:var(--b-mut)">${esc(o.handle)}</span></div></div>` +
      `<p style="margin:10px 16px 12px;font-size:14.5px;line-height:1.5">${esc(o.text)}</p>` +
      (o.img ? `<img src="${esc(o.img)}" alt="" style="width:calc(100% - 32px);margin:0 16px;border-radius:10px" loading="lazy">` : "") +
      `<div style="display:flex;gap:18px;padding:12px 16px;font-size:13px;color:var(--b-mut)"><span>♡ 2.1k</span><span>↻ 84</span><span>↩ 32</span></div>`;
    return { html: '<div class="plk-post">' + body + "</div>", css: PL_CSS };
  };
}

/* ---------------- the 50 platform widgets ---------------- */

const au = (o: AuthOpts): PR => authW(o);
const po = (o: { name: string; handle: string; chip: string; text: string; img?: string }): PR => postW(o);
const mi = (o: MiniOpts): PR => miniW(o);

export const PLATFORM_RENDERERS: Record<string, (c: WidgetConfig) => RenderResult> = {
  // -- auth pages (12)
  "auth-google": au({ accent: "#4285f4", tone: "light", card: "#ffffff", line: "#dadce0", mark: chipMark("google", 26), title: "Sign in with Google", sub: "to continue to PlanckUi", btn: "Continue", btnBg: "#4285f4", social: ["apple", "microsoft"] }),
  "auth-apple": au({ accent: "#f5f5f7", tone: "dark", card: "#101014", line: "#2a2a30", mark: chipMark("apple", 24), title: "Sign in with Apple ID", sub: "One account for everything.", btn: "Continue with Apple", btnBg: "#f5f5f7", btnColor: "#101014", social: ["google", "github"] }),
  "auth-github": au({ accent: "#58a6ff", tone: "dark", card: "#0d1117", line: "#30363d", mark: chipMark("github", 26), title: "Sign in to GitHub", sub: "Where the world builds software", btn: "Continue with GitHub", btnBg: "#238636", social: [] }),
  "auth-x": au({ accent: "#e7e9ea", tone: "dark", card: "#000000", line: "#2f3336", mark: chipMark("x", 24), title: "Join the conversation", sub: "See what is happening right now.", btn: "Create account", btnBg: "#e7e9ea", btnColor: "#000000", social: ["google", "apple"] }),
  "auth-microsoft": au({ accent: "#0067b8", tone: "light", card: "#ffffff", line: "#e5e7eb", mark: chipMark("ms", 22), title: "Sign in with Microsoft", sub: "Work, school or personal account.", btn: "Continue", btnBg: "#0067b8", social: ["google", "apple"] }),
  "auth-slack": au({ accent: "#611f69", tone: "light", card: "#ffffff", line: "#e5e7eb", mark: chipMark("slack", 24), title: "Sign in to Slack", sub: "Your workspace, one click away.", btn: "Continue with Slack", btnBg: "#611f69", social: ["google", "apple"] }),
  "auth-discord": au({ accent: "#5865f2", tone: "dark", card: "#23272a", line: "#3a3f47", mark: chipMark("discord", 24), title: "Welcome back", sub: "You are missed around here.", btn: "Login", btnBg: "#5865f2", social: [] }),
  "auth-spotify": au({ accent: "#1db954", tone: "dark", card: "#121212", line: "#2a2a2a", mark: chipMark("spotify", 26), title: "Login to Spotify", sub: "Millions of songs. Free on PlanckUi.", btn: "Continue with Spotify", btnBg: "#1db954", social: ["google", "apple"] }),
  "auth-notion": au({ chipBg: "#ffffff", accent: "#111827", tone: "light", card: "#ffffff", line: "#e5e7eb", mark: chipMark("notion", 24), title: "Notion — sign in", sub: "Your second brain, synced.", btn: "Continue with email", btnBg: "#111827", social: ["google", "apple"] }),
  "auth-linear": au({ accent: "#8b8cf8", tone: "dark", card: "#191919", line: "#2c2c2c", mark: chipMark("linear", 24), title: "Login to Linear", sub: "A better way to build products", btn: "Continue", btnBg: "#5e6ad2", social: ["google", "github"] }),
  "auth-stripe": au({ accent: "#635bff", tone: "light", card: "#ffffff", line: "#e5e7eb", mark: chipMark("stripe", 24), title: "Stripe Dashboard", sub: "Sign in to your account", btn: "Continue", btnBg: "#635bff", social: ["google", "github"] }),
  "auth-twitch": au({ accent: "#9146ff", tone: "dark", card: "#18181b", line: "#2f2f35", mark: chipMark("twitch", 24), title: "Login with Twitch", sub: "Be the first to watch live.", btn: "Continue with Twitch", btnBg: "#9146ff", social: [] }),

  // -- social posts (8)
  "x-post": po({ name: "PlanckUi", handle: "X", chip: "#000000", text: "160+ free widgets. No paywall, no credit card, no limits. Just paste it." }),
  "linkedin-post": po({ name: "PlanckUi", handle: "LinkedIn", chip: "#0a66c2", text: "We just open-sourced our entire widget catalog. 226 components, all free, forever." }),
  "reddit-post": po({ name: "r/webdev", handle: "Reddit", chip: "#ff4500", text: "I replaced my $25/month widget subscription with a free one. Ask me anything." }),
  "threads-post": po({ name: "Threads", handle: "Threads", chip: "#000000", text: "Shipping beats planning. Every time." }),
  "facebook-post": po({ name: "PlanckUi", handle: "Facebook", chip: "#1877f2", text: "Our new component catalog is live — 226 widgets, all free." }),
  "instagram-post": po({ name: "PlanckUi", handle: "Instagram", chip: "#e1306c", text: "New drop: gradient menus and pricing sections." }),
  "tiktok-post": po({ name: "TikTok", handle: "TikTok", chip: "#010101", text: "POV: your widget library is actually free" }),
  "pinterest-pin": po({ name: "Pinterest", handle: "Pinterest", chip: "#e60023", text: "Widget gallery inspiration — save this pin." }),

  // -- chat & comms (6)
  "whatsapp-chat": mi({ accent: "#25d366", tone: "light", mark: chipMark("whatsapp", 22), title: "Fern & Co.", sub: "typing…", meta: "online", btn: "Open chat", btnBg: "#25d366" }),
  "telegram-channel": mi({ accent: "#229ed9", tone: "light", mark: chipMark("telegram", 22), title: "PlanckUi News", sub: "12.4K subscribers", meta: "@planckui", btn: "Join channel", btnBg: "#229ed9" }),
  "messenger-card": mi({ chipBg: "#ffffff", accent: "#0084ff", tone: "light", mark: chipMark("messenger", 22), title: "Maya Okafor", sub: "Sent you a widget", meta: "Messenger · now", btn: "Open chat", btnBg: "#0084ff" }),
  "slack-message": mi({ chipBg: "#ffffff", accent: "#611f69", tone: "light", mark: chipMark("slack", 20), title: "Maya Okafor", sub: "Shipped the new catalog 🚀", meta: "#general · just now", btn: "Open Slack", btnBg: "#611f69" }),
  "discord-embed": mi({ accent: "#5865f2", tone: "dark", mark: chipMark("discord", 22), title: "#announcements", sub: "v2.6 — 35 new widgets just landed", meta: "Today at 4:12 PM", btn: "Open Discord", btnBg: "#5865f2" }),
  "zoom-meeting": mi({ chipBg: "#ffffff", accent: "#2d8cff", tone: "light", mark: chipMark("zoom", 22), title: "Weekly sync", sub: "Starts in 12 minutes", meta: "9 participants", btn: "Join meeting", btnBg: "#2d8cff" }),

  // -- players (5)
  "spotify-player": mi({ accent: "#1db954", tone: "dark", mark: chipMark("spotify", 22), title: "Blinding Lights — The Weeknd", sub: "After Hours", meta: "1:42 / 3:20 · Pause", btnBg: "#1db954", bar: 52 }),
  "apple-music": mi({ accent: "#fa2d48", tone: "light", mark: chipMark("apple", 22), title: "Midday Dance mix", sub: "Apple Music live radio", meta: "On air now", btn: "Listen", btnBg: "#fa2d48" }),
  "youtube-video": mi({ accent: "#ff0000", tone: "light", mark: chipMark("youtube", 22), title: "Build a widget in 10 minutes", sub: "PlanckUi · 124K views", meta: "Watch on YouTube", btn: "Play", btnBg: "#ff0000" }),
  "netflix-top10": mi({ accent: "#e50914", tone: "dark", mark: chipMark("netflix", 22), title: "#1 in TV Shows today", sub: "The Crowd — limited series", meta: "Top 10 badge earned", btn: "Play", btnBg: "#e50914" }),
  "twitch-live": mi({ accent: "#9146ff", tone: "dark", mark: chipMark("twitch", 22), title: "PlanckUiDev is live", sub: "1,204 watching", meta: "Category: Software", btn: "Watch", btnBg: "#9146ff" }),

  // -- work tools (8)
  "notion-page": mi({ chipBg: "#ffffff", accent: "#111827", tone: "light", mark: chipMark("notion", 22), title: "Product roadmap", sub: "Last edited 2h ago", meta: "Shared with 4 people", btn: "Open page", btnBg: "#111827" }),
  "figma-file": mi({ chipBg: "#ffffff", accent: "#a259ff", tone: "light", mark: chipMark("figma", 22), title: "Widget system — v3", sub: "3 collaborators online", meta: "Auto-saved", btn: "Open file", btnBg: "#a259ff" }),
  "gmail-email": mi({ chipBg: "#ffffff", accent: "#ea4335", tone: "light", mark: chipMark("gmail", 22), title: "Maya from Fern & Co.", sub: "That widget idea you had — do it", meta: "10:42 AM", btn: "Open Gmail", btnBg: "#ea4335" }),
  "google-docs": mi({ chipBg: "#ffffff", accent: "#4285f4", tone: "light", mark: chipMark("gdocs", 22), title: "Launch checklist", sub: "Edited by 3 people", meta: "Docs", btn: "Open doc", btnBg: "#4285f4" }),
  "drive-meter": mi({ chipBg: "#ffffff", accent: "#4285f4", tone: "light", mark: chipMark("gdrive", 22), title: "Google Drive", sub: "9.2 GB of 15 GB used", meta: "62% full", bar: 62, btn: "Manage storage", btnBg: "#4285f4" }),
  "dropbox-file": mi({ chipBg: "#ffffff", accent: "#0061ff", tone: "light", mark: chipMark("dropbox", 22), title: "brand-assets.zip", sub: "Shared with 3 people", meta: "Synced just now", btn: "Open Dropbox", btnBg: "#0061ff" }),
  "trello-board": mi({ chipBg: "#ffffff", accent: "#0079bf", tone: "light", mark: chipMark("trello", 22), title: "Launch board", sub: "4 lists · 18 cards", meta: "Updated 5m ago", btn: "Open board", btnBg: "#0079bf" }),
  "github-pr": mi({ accent: "#238636", tone: "dark", mark: chipMark("github", 22), title: "Add 35 platform widgets", sub: "#482 · opened by you", meta: "✓ All checks passed", btn: "Open pull request", btnBg: "#238636" }),

  // -- commerce & finance (8)
  "stripe-payment": mi({ chipBg: "#ffffff", accent: "#635bff", tone: "light", mark: chipMark("stripe", 22), title: "Pay $49.00", sub: "PlanckUi Pro — monthly", meta: "Powered by Stripe", btn: "Pay now", btnBg: "#635bff" }),
  "paypal-checkout": mi({ chipBg: "#ffffff", accent: "#0070ba", tone: "light", mark: chipMark("paypal", 22), title: "PayPal Checkout", sub: "$49.00 to PlanckUi", meta: "Buyer protection included", btn: "Pay with PayPal", btnBg: "#0070ba" }),
  "venmo-send": mi({ chipBg: "#ffffff", accent: "#3d95ce", tone: "light", mark: chipMark("venmo", 22), title: "Send $25", sub: "To: Maya Okafor", meta: "Instant transfer", btn: "Send", btnBg: "#3d95ce" }),
  "metamask-connect": mi({ chipBg: "#ffffff", accent: "#f6851b", tone: "dark", mark: chipMark("metamask", 22), title: "MetaMask", sub: "Connect your wallet to continue", meta: "Ethereum Mainnet", btn: "Connect wallet", btnBg: "#f6851b" }),
  "shopify-order": mi({ chipBg: "#ffffff", accent: "#5e8e3e", tone: "light", mark: chipMark("shopify", 22), title: "Order #1042", sub: "Paid · 2 items · $86.00", meta: "Shipped yesterday", btn: "Track order", btnBg: "#5e8e3e" }),
  "airbnb-listing": mi({ chipBg: "#ffffff", accent: "#ff385c", tone: "light", mark: chipMark("airbnb", 22), title: "Cabin near the lake", sub: "4.97 ★ · 212 reviews", meta: "$142 / night", btn: "Check availability", btnBg: "#ff385c" }),
  "uber-ride": mi({ accent: "#0e0e0e", tone: "dark", mark: chipMark("uber", 22), title: "Driver arriving", sub: "3 min · Toyota Prius · 7XKJ", meta: "Trip to Hauptplatz 8", btn: "Contact driver", btnBg: "#0e0e0e" }),
  "order-tracker": mi({ accent: "#0e0e0e", tone: "dark", mark: chipMark("order", 22), title: "Order #1042", sub: "Shipped · arrives Tuesday", meta: "Out for delivery", btn: "View details", btnBg: "#0e0e0e" }),

  // -- misc (3)
  "steam-game": mi({ accent: "#1b2838", tone: "dark", mark: chipMark("steam", 22), title: "Factorio", sub: "Overwhelmingly positive · 38€", meta: "Now playing", btn: "View store page", btnBg: "#1b2838" }),
  "play-store-app": mi({ chipBg: "#ffffff", accent: "#34a853", tone: "light", mark: chipMark("gplay", 22), title: "PlanckUi Widgets", sub: "4.8 ★ · 12K reviews", meta: "Install — 8 MB", btn: "Install", btnBg: "#34a853" }),
  "ph-launch": mi({ chipBg: "#ffffff", accent: "#da552f", tone: "light", mark: chipMark("ph", 22), title: "PlanckUi 2.0 launch", sub: "▲ 482 upvotes · #3 today", meta: "Product Hunt", btn: "View launch", btnBg: "#da552f" }),

  // -- extras (5)
  "wa-cta": (c) => {
    
    const body =
      `<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">` +
      `<span class="pf-mark" style="margin:0;background:#25d366;color:#fff">${chipMark("whatsapp", 22)}</span>` +
      `<div><b style="font-size:14.5px">Chat with us</b><div style="font-size:12px;color:var(--b-mut)">Typically replies in minutes</div></div>` +
      `<span style="margin-left:auto;width:10px;height:10px;border-radius:999px;background:#25d366;box-shadow:0 0 0 0 oklch(0.75 0.18 150 / 0.6);animation:pf-pulse 1.8s infinite"></span></div>` +
      `<p style="margin:0 0 14px;font-size:13.5px;color:var(--b-mut)">Questions about sizes, shipping or returns? Message us on WhatsApp — a human answers, not a bot.</p>` +
      `<button class="pf-btn" type="button" style="background:#25d366">Chat on WhatsApp</button>`;
    const css = PL_CSS + "@keyframes pf-pulse{0%{box-shadow:0 0 0 0 oklch(0.75 0.18 150 / 0.55)}70%{box-shadow:0 0 0 12px oklch(0.75 0.18 150 / 0)}100%{box-shadow:0 0 0 0 oklch(0.75 0.18 150 / 0)}}";
    return { html: '<div class="pf-mini" style="--b-accent:#25d366">' + body + "</div>", css };
  },
  "ig-grid": () => {
    const tiles = ["#f9ce34,#ee2a7b,#6228d7", "#0f2027,#2c5364", "#f64f59,#c471ed,#12c2e9", "#ff9966,#ff5e62", "#16a085,#f4d03f", "#8e2de2,#4a00e0", "#e96443,#904e95", "#373b44,#4286f4", "#f7797d,#c471ed"]
      .map((g, i) => `<span style="aspect-ratio:1;border-radius:4px;background:linear-gradient(135deg,${g});display:grid;place-items:center;color:#fff;font-size:11px">♥ ${[214, 98, 187, 412, 76, 156, 302, 88, 245][i]}</span>`)
      .join("");
    const body =
      `<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px"><span class="pf-ava" style="border-radius:12px;background:linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)">P</span><div><b style="font-size:14px;display:block">planckui</b><span style="font-size:12px;color:var(--b-mut)">@planckui · Instagram</span></div></div>` +
      `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:5px">${tiles}</div>` +
      `<div style="margin-top:10px;font-size:12px;color:var(--b-mut)">Latest 9 posts · updated live</div>`;
    return { html: '<div class="pf-mini" style="--b-accent:#e1306c;max-width:340px">' + body + "</div>", css: PL_CSS };
  },
  "yt-card": () => {
    const body =
      `<div style="position:relative;border-radius:10px;overflow:hidden;margin-bottom:12px">` +
      `<div style="aspect-ratio:16/9;background:linear-gradient(120deg,#1f1c2c,#4e54c8 55%,#8f94fb);display:grid;place-items:center">` +
      `<span style="width:54px;height:38px;border-radius:10px;background:#ff0000;display:grid;place-items:center;box-shadow:0 8px 24px oklch(0 0 0/0.35)"><svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M8 5.5v13l11-6.5-11-6.5z"/></svg></span></div>` +
      `<span style="position:absolute;right:8px;bottom:8px;background:oklch(0 0 0/0.8);color:#fff;font-size:11px;padding:2px 6px;border-radius:4px">10:24</span></div>` +
      `<div style="display:flex;gap:10px"><span class="pf-ava" style="background:#ff0000">${chipMark("youtube", 18)}</span>` +
      `<div><b style="font-size:14px;display:block;line-height:1.35">Build a widget in 10 minutes</b>` +
      `<span style="font-size:12px;color:var(--b-mut)">PlanckUi · 124K views · 2 days ago</span></div></div>`;
    return { html: '<div class="pf-mini" style="--b-accent:#ff0000;max-width:360px">' + body + "</div>", css: PL_CSS };
  },
  "tg-chat": () => {
    const bubble = (me: boolean, txt: string, time: string) =>
      `<div style="display:flex;justify-content:${me ? "flex-end" : "flex-start"}">` +
      `<div style="max-width:78%;padding:9px 12px;border-radius:14px;font-size:13.5px;line-height:1.45;color:${me ? "#fff" : "var(--b-ink)"};background:${me ? "linear-gradient(135deg,#2dabf2,#229ed9)" : "var(--b-input,var(--b-card))"}">${txt}<span style="display:block;font-size:10px;opacity:0.6;text-align:right;margin-top:2px">${time}</span></div></div>`;
    const body =
      `<div style="display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid var(--b-line);margin-bottom:12px">` +
      `<span class="pf-ava" style="background:linear-gradient(135deg,#2dabf2,#229ed9)">${chipMark("telegram", 18)}</span>` +
      `<div><b style="font-size:14px">Design Shenanigans</b><div style="font-size:11.5px;color:var(--b-mut)">8,412 members, 214 online</div></div></div>` +
      bubble(false, "Just shipped the new widget catalog 🚀", "10:41") +
      bubble(true, "the pricing cards are unreal", "10:42") +
      bubble(false, "wait till you see the aurora ones ✨", "10:43");
    return { html: '<div class="pf-mini" style="--b-accent:#229ed9;max-width:360px">' + body + "</div>", css: PL_CSS };
  },
  "li-banner": () => {
    const body =
      `<div style="height:64px;border-radius:10px;background:linear-gradient(120deg,#0a66c2,#004182);margin:-28px -28px 34px"></div>` +
      `<div style="display:flex;align-items:flex-end;gap:12px;margin-top:-46px;margin-bottom:14px">` +
      `<span class="pf-ava" style="width:56px;height:56px;font-size:20px;background:#0a66c2;outline:3px solid var(--b-card)">MK</span>` +
      `<button class="pf-btn" type="button" style="width:auto;margin-left:auto;padding:8px 18px;background:#0a66c2">+ Follow</button></div>` +
      `<b style="font-size:16px">Maya Kowalski</b>` +
      `<div style="font-size:13px;color:var(--b-mut);margin:2px 0 10px">Design engineer · building PlanckUi in public</div>` +
      `<div style="font-size:12.5px;color:var(--b-mut)"><b style="color:var(--b-ink)">18,204</b> followers · <b style="color:var(--b-ink)">412</b> posts</div>`;
    return { html: '<div class="pf-mini" style="--b-accent:#0a66c2;max-width:380px">' + body + "</div>", css: PL_CSS };
  },
};
