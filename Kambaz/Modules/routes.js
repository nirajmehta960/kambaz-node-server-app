import ModulesDao from "../Modules/dao.js";

export default function ModulesRoutes(app, db) {
  const dao = ModulesDao(db);

  const findModulesForCourse = async (req, res) => {
    try {
    const { courseId } = req.params;
    const modules = await dao.findModulesForCourse(courseId);
    res.json(modules);
    } catch (error) {
      console.error("Error in findModulesForCourse route:", error);
      res.status(500).json({ error: "Failed to fetch modules" });
    }
  };
  app.get("/api/courses/:courseId/modules", findModulesForCourse);

  const createModuleForCourse = async (req, res) => {
    try {
    const { courseId } = req.params;
      const module = { ...req.body };
    const newModule = await dao.createModule(courseId, module);
      res.json(newModule);
    } catch (error) {
      console.error("Error in createModuleForCourse route:", error);
      res.status(500).json({ error: "Failed to create module" });
    }
  };
  app.post("/api/courses/:courseId/modules", createModuleForCourse);

  const deleteModule = async (req, res) => {
    try {
    const { moduleId } = req.params;
    const status = await dao.deleteModule(moduleId);
      res.json(status);
    } catch (error) {
      console.error("Error in deleteModule route:", error);
      res.status(500).json({ error: "Failed to delete module" });
    }
  };
  app.delete("/api/modules/:moduleId", deleteModule);

  const updateModule = async (req, res) => {
    try {
    const { moduleId } = req.params;
    const moduleUpdates = req.body;
    const status = await dao.updateModule(moduleId, moduleUpdates);
      res.json(status);
    } catch (error) {
      console.error("Error in updateModule route:", error);
      res.status(500).json({ error: "Failed to update module" });
    }
  };
  app.put("/api/modules/:moduleId", updateModule);
}
