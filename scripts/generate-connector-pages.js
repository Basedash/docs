const fs = require("fs");
const path = require("path");

// Import the list of connectors to ignore (not overwrite)
const ignoredConnectors = require("./ignored-connectors");

// Read and parse the connectors data
const rawData = fs.readFileSync(
  path.join(__dirname, "fivetran-connectors-response.json"),
  "utf8"
);
const connectorsData = JSON.parse(rawData).data;

// Read the template
const template = fs.readFileSync(
  path.join(__dirname, "../data-sources/connectors/_template.mdx"),
  "utf8"
);

// Create connectors directory if it doesn't exist
const connectorsDir = path.join(__dirname, "../data-sources/connectors");
if (!fs.existsSync(connectorsDir)) {
  fs.mkdirSync(connectorsDir, { recursive: true });
}

// Track pages for docs.json update
const connectorPages = [];

// Generate pages for each connector
connectorsData.forEach((connector) => {
  // Skip if type is Hvr or status is not GA/beta
  if (
    connector.type === "Hvr" ||
    !["general_availability", "beta"].includes(connector.service_status)
  ) {
    return;
  }

  // Create filename from connector id
  const filename = `${connector.id}.mdx`;
  const filePath = path.join(connectorsDir, filename);

  // Check if this connector should be ignored (not overwritten)
  const shouldIgnore =
    ignoredConnectors.includes(connector.id) && fs.existsSync(filePath);

  if (shouldIgnore) {
    console.log(
      `Skipping ${connector.name} (${connector.id}) - file exists and is in ignore list`
    );
  } else {
    // Replace template variables
    let content = template
      .replace(/{{name}}/g, connector.name)
      .replace(
        /{{docs_link}}/g,
        connector.link_to_docs || "https://fivetran.com/docs"
      )
      .replace(
        /{{status}}/g,
        connector.service_status === "general_availability"
          ? "Generally Available"
          : "Beta"
      );

    // Write the file
    fs.writeFileSync(filePath, content);
    console.log(`Generated page for ${connector.name}`);
  }

  // Add to pages list
  connectorPages.push(`data-sources/connectors/${connector.id}`);
});

// Update docs.json
const docsJsonPath = path.join(__dirname, "../docs.json");
const docsConfig = JSON.parse(fs.readFileSync(docsJsonPath, "utf8"));

// Find the "Data sources" tab
const dataSourcesTab = docsConfig.navigation.tabs.find(
  (tab) => tab.tab === "Data sources"
);

// Find existing Connectors group or create new one
const existingConnectorsGroupIndex = dataSourcesTab.groups.findIndex(
  (group) => group.group === "Connectors"
);

if (existingConnectorsGroupIndex !== -1) {
  // Update existing group
  dataSourcesTab.groups[existingConnectorsGroupIndex].pages =
    connectorPages.sort();
} else {
  // Add new group
  dataSourcesTab.groups.push({
    group: "Connectors",
    pages: connectorPages.sort(),
  });
}

// Write updated docs.json
fs.writeFileSync(docsJsonPath, JSON.stringify(docsConfig, null, 2));
