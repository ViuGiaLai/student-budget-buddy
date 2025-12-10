// HashRouter không hỗ trợ useMatches; giữ hook an toàn, trả về undefined
export const useRouteHandle = () => {
  return [undefined, undefined] as const;
};

