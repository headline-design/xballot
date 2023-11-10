import { SCHEMA_REPORT } from "@xballot/sdk";

const Report = SCHEMA_REPORT;

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Report management
 */

/**
 * @swagger
 * /v1/reports/{appId}:
 *   get:
 *     summary: Get report by AppId
 *     description: Get a report by its AppId.
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: appId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the app to get
 *     responses:
 *       200:
 *         description: Returns a single report
 *       404:
 *         description: Report not found
 *       500:
 *         description: An error occurred
 */
export const getReportByAppId = async (req, res) => {
  try {
    const appId = parseInt(req.params.appId);
    const report = await Report.findOne({ appId });
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    // Cleaning up the report object
    const { _id, __v, createdAt, updatedAt, ...cleanedReport } = report._doc;
    res.json(cleanedReport);
  } catch (error) {
    console.error(`Error in retrieving report: ${error}`);
    res.status(500).json({ error: "An error occurred" });
  }
};


/**
 * @swagger
 * /v1/reports:
 *   get:
 *     summary: Get all reports
 *     description: Retrieve a list of all reports.
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Returns a list of reports
 *       500:
 *         description: An error occurred
 */

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find({});
    const transformedReports = reports.reduce((obj, report) => {
      const { _id, __v, createdAt, updatedAt, ...cleanedReport } = report._doc;
      obj[report.appId] = cleanedReport;
      return obj;
    }, {});

    res.json(transformedReports);
  } catch (error) {
    console.error(`Error in retrieving reports: ${error}`);
    res.status(500).json({ error: "An error occurred" });
  }
};
