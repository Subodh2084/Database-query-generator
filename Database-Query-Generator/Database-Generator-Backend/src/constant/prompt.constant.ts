const sqlPrompt = ({
  dbName,
  userQuery,
}: {
  dbName: string;
  userQuery: string;
}) => `
You are an expert SQL assistant.

The target database is named **${dbName}**.

### User Request:
${userQuery}

### Instructions:
- Write a valid SQL query to answer the user’s question.
- Do not explain the query. Output only the SQL code.
- If multiple interpretations are possible, choose the most likely one.
- Do not assume non-standard SQL unless explicitly stated.
- Make educated assumptions about the table and column names based on the database name and user request.

### Output:
SQL Query:
`;

const sqlCorrectionPrompt = ({
  dbName,
  incorrectQuery,
}: {
  dbName: string;
  incorrectQuery: string;
}) => `
  You are an expert SQL assistant.
  
  The target database is named **${dbName}**.
  
  ### Problem:
  The following SQL query is not working as intended:
  \`\`\`sql
  ${incorrectQuery}
  \`\`\`
  

  
  ### Instructions:
  - Correct the SQL query so that it works properly with the given database.
  - Make smart assumptions about table and column names based on the database name and context.
  - Only output the corrected SQL code, no explanations.
  
  ### Output:
  Fixed SQL Query:
  `;

const sqlIssueExplanationPrompt = ({
  dbName,
  incorrectQuery,
}: {
  dbName: string;
  incorrectQuery: string;
}) => `
  You are an expert SQL assistant.
  
  The target database is **${dbName}**.
  
  ### SQL Query:
  \`\`\`sql
  ${incorrectQuery}
  \`\`\`
  
  ### Task:
  - Analyze the SQL query and the issue described.
  - Explain in detail what is wrong with the query.
  - Include possible reasons such as syntax mistakes, incorrect table/column names, wrong values, or logic issues.
  - Make smart assumptions based on the database name.
  - Do not return a fixed query, only the explanation.
  
  ### Output:
  Explanation of the issue:
  `;

export { sqlPrompt, sqlCorrectionPrompt, sqlIssueExplanationPrompt };
