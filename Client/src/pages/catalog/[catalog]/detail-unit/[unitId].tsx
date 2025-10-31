import { useRouter } from 'next/router';
import UnitCatalogPage from '../../../../modules/pages/catalogPage/components/UnitPage/UnitCatalogPage';

const UnitDetailPage = () => {
  const router = useRouter();
  const { catalog, unitId } = router.query;

  if (!catalog || !unitId) {
    return null; // Or a loading spinner
  }

  return <UnitCatalogPage catalogId={catalog as string} unitId={unitId as string} />;
};

export default UnitDetailPage;