import { type ReactNode, useEffect, useState } from 'react';

import { App, Card, Col, Row, Skeleton } from 'antd';

import {
    AppstoreOutlined,
    BuildOutlined,
    FileTextOutlined,
    ShopOutlined,
    UserOutlined,
} from '@ant-design/icons';

import { useAuth } from '@contexts/Auth.context';
import { handleServiceError, hasServiceError } from '@helpers/Service.helper';
import { listCondominiums } from '@services/Condominium.service';
import { listPeople } from '@services/Person.service';
import { listQuotes } from '@services/Quote.service';
import { listSuppliers } from '@services/Supplier.service';
import { listUnits } from '@services/Unit.service';

type Counts = {
    units: number;
    condominiums: number;
    quotes: number;
    people: number;
    suppliers: number;
};

function CountCard({
    icon,
    count,
    label,
}: {
    icon: ReactNode;
    count: number;
    label: string;
}) {
    return (
        <Card size="small" style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 28, color: '#36bc49' }}>{icon}</div>
                <div>
                    <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.2 }}>{count}</div>
                    <div style={{ fontSize: 14, color: '#6b7280' }}>{label}</div>
                </div>
            </div>
        </Card>
    );
}

function CardSkeleton() {
    return (
        <Card size="small" style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Skeleton.Avatar active size={32} shape="square" />
                <div style={{ flex: 1 }}>
                    <Skeleton.Input active size="small" style={{ width: 48, marginBottom: 8 }} />
                    <Skeleton.Input active size="small" block style={{ width: 80 }} />
                </div>
            </div>
        </Card>
    );
}

export function Dashboard() {
    const { user } = useAuth();
    const app = App.useApp();
    const [isLoading, setIsLoading] = useState(true);
    const [counts, setCounts] = useState<Counts | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setIsLoading(true);

            const [unitsRes, condosRes, quotesRes, peopleRes, suppliersRes] = await Promise.all([
                listUnits(),
                listCondominiums(),
                listQuotes(),
                listPeople(),
                listSuppliers(),
            ]);

            if (cancelled) return;

            [
                unitsRes,
                condosRes,
                quotesRes,
                peopleRes,
                suppliersRes,
            ].forEach(res => {
                if (hasServiceError(res)) handleServiceError(app, res);
            });

            setCounts({
                units: hasServiceError(unitsRes) ? 0 : unitsRes.data.units.length,
                condominiums: hasServiceError(condosRes) ? 0 : condosRes.data.condominiums.length,
                quotes: hasServiceError(quotesRes) ? 0 : quotesRes.data.quotes.length,
                people: hasServiceError(peopleRes) ? 0 : peopleRes.data.people.length,
                suppliers: hasServiceError(suppliersRes) ? 0 : suppliersRes.data.suppliers.length,
            });
            setIsLoading(false);
        }

        load();
        return () => { cancelled = true; };
    }, [app]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
                <h1 style={{ color: '#000', margin: 0 }}>
                    Bem-vindo, <span>{user?.name}</span>!
                </h1>
                <p style={{ color: '#6b7280', padding: 0, margin: '8px 0 0' }}>
                    A <b style={{ color: '#36bc49' }}>revolução</b> da gestão condominial começa{' '}
                    <b style={{ color: '#36bc49' }}>aqui</b>
                </p>
            </div>

            <Row gutter={[16, 16]}>
                {isLoading ? (
                    <>
                        {[1, 2, 3, 4, 5].map(key => (
                            <Col key={key} xs={24} sm={12} md={8} lg={6}>
                                <CardSkeleton />
                            </Col>
                        ))}
                    </>
                ) : counts !== null ? (
                    <>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <CountCard
                                icon={<AppstoreOutlined />}
                                count={counts.units}
                                label="Unidades"
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <CountCard
                                icon={<BuildOutlined />}
                                count={counts.condominiums}
                                label="Condomínios"
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <CountCard
                                icon={<FileTextOutlined />}
                                count={counts.quotes}
                                label="Orçamentos"
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <CountCard
                                icon={<UserOutlined />}
                                count={counts.people}
                                label="Pessoas"
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <CountCard
                                icon={<ShopOutlined />}
                                count={counts.suppliers}
                                label="Fornecedores"
                            />
                        </Col>
                    </>
                ) : null}
            </Row>
        </div>
    );
}