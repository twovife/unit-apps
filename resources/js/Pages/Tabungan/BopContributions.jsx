import OfficeContributionPage from '@/Components/Tabungan/OfficeContributionPage';

export default function BopContributions(props) {
  return (
    <OfficeContributionPage
      {...props}
      title="Iuran BOP"
      routePrefix="bop"
      historyRouteName="bop.api.contributions.history"
      destroyRouteName="bop.contributions.destroy"
      targetAmount={1500000}
    />
  );
}
