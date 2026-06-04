'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleDeed, deleteDeed } from '@/store/deedsSlice';

export function DeedsList() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.deeds.items);

  if (items.length === 0) {
    return <p className="text-center text-gray-400 mt-6">No deeds yet. Add your first good deed!</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((deed) => (
        <li key={deed.id} className="bg-white rounded-lg shadow px-5 py-4 flex items-start gap-4">
          <input
            type="checkbox"
            checked={deed.completed}
            onChange={() => dispatch(toggleDeed({ id: deed.id, completed: !deed.completed }))}
            className="mt-1 w-4 h-4 cursor-pointer"
          />
          <div className="flex-1">
            <p className={`font-medium ${deed.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {deed.title}
            </p>
            {deed.description && (
              <p className="text-sm text-gray-500 mt-1">{deed.description}</p>
            )}
          </div>
          <button
            onClick={() => dispatch(deleteDeed(deed.id))}
            className="text-red-400 hover:text-red-600 text-sm transition-colors"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
