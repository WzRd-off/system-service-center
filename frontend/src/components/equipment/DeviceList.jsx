import { DeviceCard } from './DeviceCard.jsx';

export function DeviceList({ devices = [] }) {
  if (!devices.length) return <p>Техніки не додано</p>;
  return (
    <div className="device-list">
      {devices.map((d) => <DeviceCard key={d.id} device={d} />)}
    </div>
  );
}
