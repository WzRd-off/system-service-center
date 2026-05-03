import { DeviceCard } from './DeviceCard.jsx';

export function DeviceList({ devices }) {
  const items = Array.isArray(devices) ? devices : [];
  if (!items.length) return <p>Техніки не додано</p>;
  return (
    <div className="device-list">
      {items.map((d) => <DeviceCard key={d.id} device={d} />)}
    </div>
  );
}
