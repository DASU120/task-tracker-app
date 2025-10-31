// backend/src/services/insight.service.js
const db = require('../db/database');

function getInsights() {
  // Total open tasks
  const totalOpen = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'Open'").get().count;

  // Priority distribution
  const priorityRows = db.prepare(`
    SELECT priority, COUNT(*) as count
    FROM tasks
    WHERE status = 'Open'
    GROUP BY priority
  `).all();

  const priorityDistribution = {};
  let maxPriority = 'Medium';
  let maxCount = 0;
  let totalCount = 0;

  priorityRows.forEach(row => {
    priorityDistribution[row.priority] = row.count;
    totalCount += row.count;
    if (row.count > maxCount) {
      maxCount = row.count;
      maxPriority = row.priority;
    }
  });

  // Tasks due in next 3 days
  const today = new Date();
  const soonDate = new Date();
  soonDate.setDate(today.getDate() + 3);
  const soonDateString = soonDate.toISOString().split('T')[0];

  const dueSoonCount = db.prepare(`
    SELECT COUNT(*) as count
    FROM tasks
    WHERE status = 'Open'
      AND due_date BETWEEN ? AND ?
  `).get(today.toISOString().split('T')[0], soonDateString).count;

  // Generate summary
  let insight = `You have **${totalOpen}** open tasks.`;

  if (dueSoonCount > 0) {
    insight += ` **${dueSoonCount}** are due within the next 3 days.`;
  }

  if (totalCount > 0 && maxCount / totalCount > 0.5) {
    insight += ` Most of your backlog is categorized as **${maxPriority}** priority.`;
  }

  return {
    totalOpen,
    priorityDistribution,
    dueSoonCount,
    summary: insight
  };
}

module.exports = { getInsights };