import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserInfo } from 'zmp-sdk';
import { User, AuthContextType, MOCK_USER } from '@/types';
import { supabase } from '@/lib/supabase';

// Check if we're in development mode
const IS_DEV = import.meta.env.DEV;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate random avatar
const generateRandomAvatar = (): string => {
    const randomImg = Math.floor(Math.random() * 70);
    return `https://i.pravatar.cc/150?img=${randomImg}`;
};

// Helper to normalize Zalo display name
const getDisplayName = (userInfo: any) => {
    return (
      userInfo?.displayName ||
      userInfo?.name ||
      userInfo?.user_alias ||
      'Sinh viên'
    );
};
// Helper function to get user info from Zalo
const getZaloUserInfo = async (): Promise<User | null> => {
    try {
        const userInfo = await new Promise<any>((resolve, reject) => {
            getUserInfo({
                success: (data) => resolve(data.userInfo),
                fail: (error) => reject(error)
            });
        });

        const userData: User = {
            id: userInfo.id,
            name: getDisplayName(userInfo),
            avatar: generateRandomAvatar(), // Use random avatar instead of Zalo's
            email: userInfo.email || `${userInfo.id}@zalo.vn`,
            isLoggedIn: true,
            isDev: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        return userData;
    } catch (error) {
        console.error('Error getting Zalo user info:', error);
        return null;
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Helper function to save/update user in Supabase
    const saveUserToSupabase = async (userData: User) => {
        try {
            const { data, error: supabaseError } = await supabase
                .from('users')
                .upsert(
                    {
                        id: userData.id,
                        name: userData.name,
                        email: userData.email,
                        avatar: userData.avatar,
                        is_dev: userData.isDev || false,
                        created_at: userData.createdAt || new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    },
                    { onConflict: 'id' }
                )
                .select();

            if (supabaseError) {
                console.error('Error saving user to Supabase:', supabaseError);
            }

            return data;
        } catch (err) {
            console.error('Failed to save user:', err);
        }
    };

    // Auto-login on app load
    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);
            try {
                // Check if user is already in localStorage
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                    setLoading(false);
                    return;
                }

                if (IS_DEV) {
                    // Chế độ phát triển: dùng MOCK_USER
                    await saveUserToSupabase(MOCK_USER);
                    setUser(MOCK_USER);
                    localStorage.setItem('user', JSON.stringify(MOCK_USER));
                } else {
                    // Production: lấy thông tin từ Zalo Mini App
                    const zaloUser = await getZaloUserInfo();
                    if (zaloUser) {
                        await saveUserToSupabase(zaloUser);
                        setUser(zaloUser);
                        localStorage.setItem('user', JSON.stringify(zaloUser));
                    } else {
                        setError('Không thể lấy thông tin người dùng từ Zalo');
                    }
                }
            } catch (err) {
                console.error('Failed to initialize auth:', err);
                setError('Lỗi khởi tạo ứng dụng');
            } finally {
                setLoading(false);
            }
        };
        initializeAuth();
    }, []);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const login = async () => {
        // Re-fetch user info from Zalo if needed
        setLoading(true);
        try {
            const zaloUser = await getZaloUserInfo();
            if (zaloUser) {
                await saveUserToSupabase(zaloUser);
                setUser(zaloUser);
                localStorage.setItem('user', JSON.stringify(zaloUser));
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Lỗi đăng nhập');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};