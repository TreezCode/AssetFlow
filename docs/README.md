# Documentation Organization

This folder contains technical documentation for Renamerly development and deployment.

---

## 📁 Folder Structure

### **`/docs` (Committed to Repo)**
Developer-facing documentation useful for contributors and deployment.

**Design & Architecture:**
- `BUILD_WITH_TREEZ_DESIGN_SYSTEM.md` - Complete design system reference
- `DATABASE_SCHEMA.md` - Supabase database schema and migrations
- `SECURITY.md` - Security best practices and guidelines
- `context.md` - Project context and overview

**Setup & Deployment:**
- `ENVIRONMENT_SETUP.md` - Local development environment setup
- `EDGE_FUNCTION_SETUP.md` - Supabase Edge Function deployment
- `PRODUCTION_DEPLOYMENT.md` - Production deployment checklist
- `PRODUCTION_STRIPE_SETUP.md` - Stripe production configuration
- `STRIPE_WEBHOOK_SETUP.md` - Webhook configuration guide

---

### **`/docs/docs-local` (Gitignored - Local Only)**
Development artifacts, analysis, and planning documents.

**Competitive & Strategic:**
- `COMPETITIVE_ANALYSIS.md` - Market analysis vs competitors
- `PRD.md` - Product Requirements Document

**Audits & Reports:**
- `DESIGN_AUDIT_REPORT.md` - Design system audit findings
- `LIGHTHOUSE_ANALYSIS.md` - Performance audit results
- `lighthouse-mobile.json` - Lighthouse report (before optimization)
- `lighthouse-mobile-after.json` - Lighthouse report (after optimization)

**Development Artifacts:**
- `TESTING_GUIDE.md` - Testing procedures and scenarios
- `FAVICON_GENERATION_TODO.md` - Favicon generation checklist

---

## 🎯 When to Add Documentation

### **Add to `/docs` (Repo) if:**
- ✅ Needed by contributors or team members
- ✅ Required for deployment or setup
- ✅ Technical reference (schema, API, design system)
- ✅ Security or compliance documentation
- ✅ Useful for future maintainers

### **Add to `/docs/docs-local` (Local) if:**
- 📊 Performance reports or audit artifacts
- 📈 Market research or competitive analysis
- 📝 Internal planning documents (PRDs, roadmaps)
- 🎨 Design iteration artifacts
- 🧪 Testing notes or QA reports
- ✅ Completed task checklists

---

## 📝 Contributing

When adding new documentation:

1. **Determine location:** Is this useful for the repo or just local development?
2. **Use markdown:** All docs should be `.md` format
3. **Add to this README:** Update the appropriate section above
4. **Keep organized:** Use clear headings and structure
5. **Link when relevant:** Cross-reference related docs

---

## 🔗 Related Resources

- **Main README:** `/README.md` - Project overview and quick start
- **Plans:** `/.agents/plans/` - Development phase plans
- **Code Docs:** In-code comments and JSDoc annotations
