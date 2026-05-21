const PageContainer = ({ children }) => {

  return (
    <div className="flex-1 p-8 overflow-auto">
      {children}
    </div>
  );
};

export default PageContainer;