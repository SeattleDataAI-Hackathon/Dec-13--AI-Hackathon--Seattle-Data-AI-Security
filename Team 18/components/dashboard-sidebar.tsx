'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  MapPin,
  Settings,
  Sparkles,
  MessageSquare,
  ServerIcon,
  ChevronsUpDown,
  Pencil,
  Github,
  Home,
  FolderOpen,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { MCPServerManager } from './mcp-server-manager';
import { ThemeToggle } from './theme-toggle';
import { getUserId, getUserName, updateUserName } from '@/lib/user-id';
import { useMCP } from '@/lib/context/mcp-context';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [mcpSettingsOpen, setMcpSettingsOpen] = useState(false);
  const [editUserNameOpen, setEditUserNameOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const { mcpServers, setMcpServers, selectedMcpServers, setSelectedMcpServers } = useMCP();

  useEffect(() => {
    setUserId(getUserId());
    setUserName(getUserName());
  }, []);

  const getUserInitials = () => {
    if (!userName) return 'G';
    return userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSaveUserName = () => {
    if (newUserName.trim()) {
      updateUserName(newUserName.trim());
      setUserName(newUserName.trim());
      setEditUserNameOpen(false);
      setNewUserName('');
    }
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Content', href: '/dashboard/content', icon: FileText },
    { name: 'Library', href: '/dashboard/library', icon: FolderOpen },
    { name: 'Opportunities', href: '/dashboard/opportunities', icon: MapPin },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="border-b border-border/40 p-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground flex-shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            {!isCollapsed && <span className="text-xl font-bold">Co-Creator</span>}
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href, item.exact)}
                      tooltip={isCollapsed ? item.name : undefined}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-border/40 mt-auto">
          <div className={`flex flex-col ${isCollapsed ? 'items-center' : ''} gap-3`}>
            <Button
              variant="outline"
              className={cn('w-full justify-start', isCollapsed ? 'w-8 h-8 p-0' : '')}
              onClick={() => setMcpSettingsOpen(true)}
              title={isCollapsed ? 'MCP Servers' : undefined}
            >
              <ServerIcon className={`${isCollapsed ? '' : 'mr-2'} h-4 w-4`} />
              {!isCollapsed && <span>MCP Servers</span>}
            </Button>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                {isCollapsed ? (
                  <Button variant="ghost" className="w-8 h-8 p-0 flex items-center justify-center">
                    <Avatar className="h-6 w-6 rounded-lg bg-primary/20">
                      <AvatarFallback className="rounded-lg text-xs font-medium text-primary">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal bg-transparent border border-border/60 shadow-none px-2 h-10 hover:bg-secondary/50"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7 rounded-lg bg-primary/20">
                        <AvatarFallback className="rounded-lg text-sm font-medium text-primary">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid text-left text-sm leading-tight">
                        <span className="truncate font-medium text-foreground/90">
                          {userName || 'Guest'}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          Co-Creator User
                        </span>
                      </div>
                    </div>
                    <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isCollapsed ? 'top' : 'top'}
                align={isCollapsed ? 'start' : 'end'}
                sideOffset={8}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg bg-primary/20">
                      <AvatarFallback className="rounded-lg text-sm font-medium text-primary">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-foreground/90">
                        {userName || 'Guest'}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        Co-Creator User
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setEditUserNameOpen(true);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4 hover:text-sidebar-accent" />
                    {userName ? 'Edit Name' : 'Set Your Name'}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setMcpSettingsOpen(true);
                    }}
                  >
                    <ServerIcon className="mr-2 h-4 w-4 hover:text-sidebar-accent" />
                    MCP Servers
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      window.open('https://github.com/deepakkamboj/scira-mcp-ui-chat', '_blank');
                    }}
                  >
                    <Github className="mr-2 h-4 w-4 hover:text-sidebar-accent" />
                    GitHub
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <Sparkles className="mr-2 h-4 w-4 hover:text-sidebar-accent" />
                        Theme
                      </div>
                      <ThemeToggle className="h-6 w-6" />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarFooter>
      </Sidebar>

      <MCPServerManager
        servers={mcpServers}
        onServersChange={setMcpServers}
        selectedServers={selectedMcpServers}
        onSelectedServersChange={setSelectedMcpServers}
        open={mcpSettingsOpen}
        onOpenChange={setMcpSettingsOpen}
      />

      <Dialog open={editUserNameOpen} onOpenChange={setEditUserNameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{userName ? 'Edit Your Name' : 'Set Your Name'}</DialogTitle>
            <DialogDescription>
              Choose how you&apos;d like to be addressed.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveUserName();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserNameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUserName}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
