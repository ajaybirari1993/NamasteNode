export const isUserEditAllowed = (updateData, ALLOWED_UPDATES) => {
  const isValidOperation = Object.keys(updateData).every((key) =>
    ALLOWED_UPDATES.includes(key),
  );

  return isValidOperation;
};
