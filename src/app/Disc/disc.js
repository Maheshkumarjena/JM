// difference

export const ExclusiveCalc = (MRP, TOTAL_AMOUNT, GST, QUANTITY) => {
  MRP = parseFloat(MRP);
  TOTAL_AMOUNT = parseFloat(TOTAL_AMOUNT);
  QUANTITY = parseFloat(QUANTITY);

  const PP = (TOTAL_AMOUNT + (TOTAL_AMOUNT * GST) / 100) / QUANTITY;
  const DISC = ((MRP - PP) / MRP) * 100;
  return Math.round(DISC * 100) / 100;
};
export const ExemptCalc = (MRP, TOTAL_AMOUNT, QUANTITY) => {
  MRP = parseFloat(MRP);
  TOTAL_AMOUNT = parseFloat(TOTAL_AMOUNT);
  QUANTITY = parseFloat(QUANTITY);

  const disc = ((MRP - TOTAL_AMOUNT / QUANTITY) / MRP) * 100;
  return Math.round(disc * 100) / 100;
};
export const InclusiveCalc = (MRP, TOTAL_AMOUNT, QUANTITY) => {
  MRP = parseFloat(MRP);
  TOTAL_AMOUNT = parseFloat(TOTAL_AMOUNT);
  QUANTITY = parseFloat(QUANTITY);

  const Sp = TOTAL_AMOUNT / QUANTITY;
  const disc = ((MRP - Sp) / MRP) * 100;
  return Math.round(disc * 100) / 100;
};

export const TotalAmountCalc = (MRP, DISC, QUANTITY) => {
  MRP = parseFloat(MRP);
  DISC = parseFloat(DISC);
  QUANTITY = parseFloat(QUANTITY);

  const result = (MRP - MRP * (DISC / 100)) * QUANTITY;
  return Math.round(result * 100) / 100;
};

// Type II : Discount mentioned

export const exclusiveDM = (MRP, Quantity, discPercent, gst) => {
  MRP = parseFloat(MRP);
  Quantity = parseFloat(Quantity);
  discPercent = parseFloat(discPercent);
  gst = parseFloat(gst);

  const newMRP = MRP * Quantity;
  const amtAfterDisc = newMRP - (newMRP * discPercent) / 100;
  const amtAfterGst = amtAfterDisc + amtAfterDisc * (gst / 100);
  const newDisc = ((newMRP - amtAfterGst) / newMRP) * 100;

  return newDisc;
};

export const IGSTnewDiscPercentage = (REGULAR_DISC, GST) => {

  const newDisc = (REGULAR_DISC + GST) / (1 + (GST / 100));
  return newDisc;

}

export const IGSTnewAmount = (PRICE, NEW_IGST_DISC, QUANTITY) => {
  const newAmount = (PRICE - (PRICE * NEW_IGST_DISC)) * QUANTITY;
  return newAmount;
}
