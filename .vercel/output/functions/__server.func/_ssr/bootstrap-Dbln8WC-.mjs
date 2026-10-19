import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BkX_5rlx.mjs";
import { f as createSsrRpc } from "./router-_Zz8wlGJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bootstrap-Dbln8WC-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var getBootstrap = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(createSsrRpc("0f126b670cc421131c95d756351f046466fb5fc3761136b7e6215a6d7f62704b"));
var updateProfileMeta = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("05d164b1d0af8d41bc90e32b1e9806ce8ed6cfb13b67edaa86df25d5c470d6b8"));
var listMembers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("6f7cffd35695d85d5f0d1af0f47c5aea92ac1b349d6255ef2af992aa3a332bad"));
var setMemberRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("4e593bab6a02d795bd74ed70aeb102dae06d7b579917050ad45b76656bc03c12"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("a532d20924c3d1053795b75ee01b8637795b954c8640ae7f8d7fd8dfc36e324a"));
var submitForm = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("ffc27b78722ecd5514bcad0a8835067a10cd5e5e324427fa9da79fe4dc2781c9"));
var submitCsv = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("9152789ef44f4fe526fb1b5979227f79743eafb97e124fd5469096f020238772"));
var listSubmissions = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(createSsrRpc("0f11d35ad26297e7d987bd256b5493bb232d20d2ad83ae7712c187d62d963b96"));
var getSubmission = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("e9954ce31ba0a140a0465230830ad6511219bf6f4a48d22045e192556ae4aaf0"));
var resolveQuarantine = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("5b4a9321fb56ca1b7f7006823c09c0c2c4ee19ffe30f9cdd6ab3092bfc4b2009"));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(createSsrRpc("9702758c6fd0cb855b9213cc5e565c91c6cccffe5c6a276226117b92c405025e"));
var askQuestion = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("9d25905dc9ea357681d58df510fa436e97096afc8a5448a191588ae22cf6fdd9"));
var listThreads = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("7d08711f3d33adf7fd91a5a96b1d737ad1dd45f20531e21b3059fcde7325811b"));
var getThread = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("921b392204a07901ef22f62a9f343595485b20a02abd4b3c7d19ea6006e83770"));
var speakText = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("46fa7a23956e84efe000e45f40767cbfa7094ed877d85d0a1823cd729d540d47"));
var listSummaries = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(createSsrRpc("7aaec95af720c0cc2905e730bc870a789fd8c25aa54862f910191af9289f5a3f"));
var generateSummary = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(createSsrRpc("95e5bbd61d99d63dd5a2c59549554dfb3efb019416c023aa6e7d45666e42f618"));
var flagSummary = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("8cb4e4f7036f567b9b7033bd95c6bf4e9c047b1c24af5b808b309c223b8c9cf8"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e7b384656c5e6baa9122f37c60e1ad8575c7bb51dfecb608d1ad7d32eaee4b05"));
var exportSubmissions = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(createSsrRpc("961aaec983c70889e859a0766c7433877a6eeee48f1cc66132fd1349b082326e"));
var addSchemaField = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("4bcdb0868b0a5e402c5592045db76f2fc52cc11319a1d18bfcfc8ccca8914ae8"));
var toggleFieldRequired = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("712859bfe3f6a9106e417cd91c5854c95ad3ea7805059fc5f4e56874e2257bec"));
var listAudit = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("110e50625f84053be0eeffeec0506aaf0c27a45fa23d14010fc0a8294fb82d72"));
var ingestFeed = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("fb7b49458ab621a5db3a24d2ea5ae855aa535db261422ec896a820d7c7f27245"));
var listSavedViews = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a8fea87301eccdff455fb8ebf58bcdeefb8f11d4c10377a1833bac8dd0aa248e"));
var saveView = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("684e40b850dd8e444a57f354f0df938b3491c791f63d568a92a592fc3923ac4f"));
var deleteSavedView = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("2d183bb76cdc6ddb17e4f50cda1a4e93a283c693242c1a3c7696dd69090a51af"));
var BootstrapContext = (0, import_react.createContext)({
	data: null,
	loading: true,
	error: null,
	reload: () => {},
	viewAs: null,
	setViewAs: () => {}
});
function useBootstrap() {
	return (0, import_react.useContext)(BootstrapContext);
}
//#endregion
export { submitCsv as C, useBootstrap as D, updateProfileMeta as E, speakText as S, toggleFieldRequired as T, listSummaries as _, exportSubmissions as a, saveView as b, getBootstrap as c, getThread as d, ingestFeed as f, listSubmissions as g, listSavedViews as h, deleteSavedView as i, getDashboard as l, listMembers as m, addSchemaField as n, flagSummary as o, listAudit as p, askQuestion as r, generateSummary as s, BootstrapContext as t, getSubmission as u, listThreads as v, submitForm as w, setMemberRole as x, resolveQuarantine as y };
