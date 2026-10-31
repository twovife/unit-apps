import OfficeContributionPage from '@/Components/Tabungan/OfficeContributionPage';

export default function Contributions(props) {
  return (
    <OfficeContributionPage
      {...props}
      title="Iuran Tabungan 1 Juta"
      routePrefix="tabungan"
      historyRouteName="tabungan.api.contributions.history"
      destroyRouteName="tabungan.contributions.destroy"
      targetAmount={1000000}
    />
  );
}
