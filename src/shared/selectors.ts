// Keep shared selectors here,
export const SELECTORS = {
  partnerRows: 'tr[class*="listViewEntries"] ',
  rowsCheckboxes: 'input[class="listViewEntriesCheckBox"] ',
  partnerRowData: (index: string) =>
    `tr[class*="highlightBackgroundColor"] td[class="listViewEntryValue noWrap medium"]:nth-child(${index})`,
  contactPersonFirstName: 'td[data-field-name="firstname"]',
  contactPersonLastName: 'td[data-field-name="lastname"]',
  contactPersonEmail: 'td[data-field-name="email"]',
  contactPersonPhone: 'td[data-field-name="phone"]',
  comments:
    ' div[class*="q-message-text"] span[class="q-message-text-content"]',
  detailsTab: 'li[data-label-key="LBL_RECORD_DETAILS"]',
  streetAddress: 'div[id="Partners_detailView_fieldValue_addresslevel8a"]',
  officeNumber: 'div[id="Partners_detailView_fieldValue_localnumbera"]',
  buildingNumber:
    'div[id="Partners_detailView_fieldValue_buildingnumbera"] span div',
  city: 'div[id="Partners_detailView_fieldValue_addresslevel5a"]',
  country: 'div[id="Partners_detailView_fieldValue_addresslevel1a"] span div',
  postalCode: 'div[id="Partners_detailView_fieldValue_addresslevel7a"]',
};
