/* Ensure Swagger UI "Try it out" sends cookies when needed */
window.onload = () => {
  if (window.ui && typeof window.ui.getConfigs === 'function') {
    const cfg = window.ui.getConfigs() || {};
    const prev = cfg.requestInterceptor;
    cfg.requestInterceptor = (req) => {
      req.credentials = 'include'; // send cookies even if CORS
      return prev ? prev(req) : req;
    };
    try { window.ui.setConfigs(cfg); } catch (e) { /* no-op */ }
  }
};
