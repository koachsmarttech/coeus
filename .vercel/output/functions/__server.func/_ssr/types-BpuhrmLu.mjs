//#region node_modules/.nitro/vite/services/ssr/assets/types-BpuhrmLu.js
var REGIONS = [
	"West",
	"East",
	"North",
	"South",
	"Central"
];
var AI_MODELS = [
	{
		id: "gpt-4o-mini",
		name: "GPT-4o mini",
		blurb: "OpenAI — fast, low cost (default when using OPENAI_API_KEY)"
	},
	{
		id: "gpt-4o",
		name: "GPT-4o",
		blurb: "OpenAI — stronger analysis and chat"
	},
	{
		id: "gpt-4.1-mini",
		name: "GPT-4.1 mini",
		blurb: "OpenAI — newer mini model when available on your account"
	},
	{
		id: "grok-4.5",
		name: "Grok 4.5",
		blurb: "xAI — use with XAI_API_KEY"
	},
	{
		id: "grok-4.7",
		name: "Grok 4.7",
		blurb: "xAI — faster option when available"
	}
];
var DEFAULT_SETTINGS = {
	analysis_model: "gpt-4o-mini",
	chat_model: "gpt-4o-mini",
	rejection_alert_pct: 10
};
//#endregion
export { DEFAULT_SETTINGS as n, REGIONS as r, AI_MODELS as t };
