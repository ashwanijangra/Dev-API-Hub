import "../../styles/tabs.css";

interface TabsProps {
  activeTab: string;
  setActiveTab: React.Dispatch<
    React.SetStateAction<string>
  >;
}

function Tabs({
  activeTab,
  setActiveTab,
}: TabsProps) {

  const tabs = [
  "body",
  "headers",
  "params",
  "authorization",
  "environment",
];

  return (

    <div className="tabs">

      {tabs.map((tab) => (

        <button
          key={tab}
          className={
            activeTab === tab
              ? "tab active"
              : "tab"
          }
          onClick={() =>
            setActiveTab(tab)
          }
        >
          {tab.charAt(0).toUpperCase() +
            tab.slice(1)}
        </button>

      ))}

    </div>

  );

}

export default Tabs;