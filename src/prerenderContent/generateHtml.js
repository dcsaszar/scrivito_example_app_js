export default async function generateHtml(pageTemplate, params) {
  return pageTemplate.replace(/\$\{(\w+)\}/g, (_, name) => params[name]);
}
