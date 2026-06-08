'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchFriends, addFriend, removeFriend, fetchFriendDeeds } from '@/store/friendsSlice';
import { Deed } from '@/types/deed';

export default function FriendsPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.friends);
  const [tag, setTag] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);
  const [deeds, setDeeds] = useState<Deed[]>([]);
  const [deedsLoading, setDeedsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchFriends());
  }, [dispatch]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tag.trim().replace(/^@/, '');
    if (!clean) return;
    const result = await dispatch(addFriend(clean));
    if (addFriend.fulfilled.match(result)) setTag('');
  };

  const handleViewDeeds = async (friendId: number) => {
    if (openId === friendId) {
      setOpenId(null);
      return;
    }
    setOpenId(friendId);
    setDeedsLoading(true);
    const result = await dispatch(fetchFriendDeeds(friendId));
    if (fetchFriendDeeds.fulfilled.match(result)) setDeeds(result.payload);
    setDeedsLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Friends</h1>

        <form onSubmit={handleAdd} className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Add a friend by tag</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="@username"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded transition-colors"
            >
              Add
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </form>

        {loading && <p className="text-center text-gray-500">Loading...</p>}

        {!loading && items.length === 0 && (
          <p className="text-center text-gray-400 mt-6">No friends yet. Add one by their tag!</p>
        )}

        <ul className="space-y-3">
          {items.map((friend) => (
            <li key={friend.id} className="bg-white rounded-lg shadow px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{friend.name}</p>
                  <p className="text-sm text-gray-400">@{friend.tag}</p>
                </div>
                <button
                  onClick={() => handleViewDeeds(friend.id)}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  {openId === friend.id ? 'Hide deeds' : 'View deeds'}
                </button>
                <button
                  onClick={() => dispatch(removeFriend(friend.id))}
                  className="text-sm text-red-400 hover:text-red-600"
                >
                  Remove
                </button>
              </div>

              {openId === friend.id && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  {deedsLoading ? (
                    <p className="text-sm text-gray-400">Loading deeds...</p>
                  ) : deeds.length === 0 ? (
                    <p className="text-sm text-gray-400">No deeds yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {deeds.map((deed) => (
                        <li key={deed.id} className="flex items-start gap-2">
                          <span className={deed.completed ? 'text-green-500' : 'text-gray-300'}>
                            {deed.completed ? '✓' : '○'}
                          </span>
                          <div>
                            <p className={`text-sm ${deed.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                              {deed.title}
                            </p>
                            {deed.description && (
                              <p className="text-xs text-gray-400">{deed.description}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
