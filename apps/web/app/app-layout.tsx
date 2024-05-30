import {
  Layout,
  SidebarAccordions,
  SidebarItem,
  accordionSections,
  sections,
} from "@winrlabs/ui";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout
      sidebar={{
        sidebarFooter: <></>,
        sidebarItems: (
          <>
            <SidebarAccordions
              defaultValues={sections}
              sections={accordionSections}
            />
            <SidebarItem href="/settings">test</SidebarItem>
          </>
        ),
      }}
    >
      {children}
    </Layout>
  );
};
