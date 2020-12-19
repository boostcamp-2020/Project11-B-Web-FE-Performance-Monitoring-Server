const issueTemplate = (issue: any) =>
  `
  <tr>
    <td style="font-size: 16px; line-height: 24px; padding: 20px 0 30px 0;">
      <div style="padding:8px 0">
        <div style="font-size: 18px; font-weight: 700; padding: 8px 0;">Type</div>
        <div style="border-radius: 8px; background-color: #f4f5f6; padding: 8px 8px;">${issue.type}</div>
        <div style="font-size: 18px; font-weight: 700; padding: 16px 0;">Message</div>
        <div style="border-radius: 8px; background-color: #f4f5f6; padding: 8px 8px;">${issue.message}</div>
      </div>
    </td>
  </tr>`.trim();

export default issueTemplate;
