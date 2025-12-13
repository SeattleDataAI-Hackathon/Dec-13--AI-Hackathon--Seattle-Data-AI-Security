'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Music,
  Plus,
  Share2,
  Eye,
  Trash2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MoreHorizontal,
  Download,
  Copy,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface ContentItem {
  id: string;
  title: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  thumbnail?: string;
  description?: string;
  uploadDate: Date;
  tags: string[];
  sharedOn: string[];
}

export default function LibraryPage() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document' | 'audio'>('all');

  // Mock data - replace with actual data from your backend
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Summer Collection Promo',
      type: 'image',
      url: '/placeholder-image.jpg',
      description: 'Beautiful summer collection showcase',
      uploadDate: new Date('2024-03-15'),
      tags: ['promo', 'summer', 'collection'],
      sharedOn: ['instagram', 'facebook'],
    },
    {
      id: '2',
      title: 'Product Tutorial Video',
      type: 'video',
      url: '/placeholder-video.mp4',
      description: 'Step-by-step tutorial for using our products',
      uploadDate: new Date('2024-03-14'),
      tags: ['tutorial', 'howto'],
      sharedOn: ['youtube', 'twitter'],
    },
    {
      id: '3',
      title: 'Brand Guidelines',
      type: 'document',
      url: '/brand-guidelines.pdf',
      description: 'Official brand guidelines and assets',
      uploadDate: new Date('2024-03-10'),
      tags: ['brand', 'guidelines'],
      sharedOn: [],
    },
  ]);

  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    tags: '',
    file: null as File | null,
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const socialPlatforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
    { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'text-blue-400' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'audio':
        return <Music className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const handleUpload = () => {
    if (!newContent.title || !newContent.file) {
      toast.error('Please fill in required fields');
      return;
    }

    // Mock upload - replace with actual upload logic
    const fileType = newContent.file.type.split('/')[0];
    let itemType: ContentItem['type'] = 'document';
    
    if (fileType === 'image') {
      itemType = 'image';
    } else if (fileType === 'video') {
      itemType = 'video';
    } else if (fileType === 'audio') {
      itemType = 'audio';
    }
    
    const newItem: ContentItem = {
      id: Date.now().toString(),
      title: newContent.title,
      type: itemType,
      url: URL.createObjectURL(newContent.file),
      description: newContent.description,
      uploadDate: new Date(),
      tags: newContent.tags.split(',').map(t => t.trim()).filter(t => t),
      sharedOn: [],
    };

    setContentItems([newItem, ...contentItems]);
    setUploadDialogOpen(false);
    setNewContent({ title: '', description: '', tags: '', file: null });
    toast.success('Content uploaded successfully!');
  };

  const handleShare = () => {
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    if (selectedItem) {
      const updatedItems = contentItems.map(item =>
        item.id === selectedItem.id
          ? { ...item, sharedOn: [...new Set([...item.sharedOn, ...selectedPlatforms])] }
          : item
      );
      setContentItems(updatedItems);
      toast.success(`Content scheduled for ${selectedPlatforms.length} platform(s)`);
      setShareDialogOpen(false);
      setSelectedPlatforms([]);
      setSelectedItem(null);
    }
  };

  const handleDelete = (id: string) => {
    setContentItems(contentItems.filter(item => item.id !== id));
    toast.success('Content deleted successfully');
  };

  const filteredItems = filterType === 'all' 
    ? contentItems 
    : contentItems.filter(item => item.type === filterType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Library</h1>
          <p className="text-muted-foreground mt-1">
            Manage your creative content and distribute across platforms
          </p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Upload Content
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{contentItems.length}</p>
              </div>
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Images</p>
                <p className="text-2xl font-bold">
                  {contentItems.filter(i => i.type === 'image').length}
                </p>
              </div>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Videos</p>
                <p className="text-2xl font-bold">
                  {contentItems.filter(i => i.type === 'video').length}
                </p>
              </div>
              <Video className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Shared</p>
                <p className="text-2xl font-bold">
                  {contentItems.filter(i => i.sharedOn.length > 0).length}
                </p>
              </div>
              <Share2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>

        <TabsContent value={filterType} className="mt-6">
          {/* Content Grid */}
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No content yet</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your first piece of content to get started
                </p>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Content
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted flex items-center justify-center relative">
                    {item.type === 'image' && item.url ? (
                      <Image 
                        src={item.url} 
                        alt={item.title} 
                        fill
                        className="object-cover" 
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        {getTypeIcon(item.type)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelectedItem(item);
                          setViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelectedItem(item);
                          setShareDialogOpen(true);
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {item.uploadDate.toLocaleDateString()}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedItem(item);
                            setViewDialogOpen(true);
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedItem(item);
                            setShareDialogOpen(true);
                          }}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    {item.sharedOn.length > 0 && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Share2 className="h-3 w-3" />
                        <span className="text-xs">
                          Shared on {item.sharedOn.length} platform{item.sharedOn.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Content</DialogTitle>
            <DialogDescription>
              Add new content to your library
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file">File *</Label>
              <Input
                id="file"
                type="file"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                onChange={(e) => setNewContent({ ...newContent, file: e.target.files?.[0] || null })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter content title"
                value={newContent.title}
                onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your content"
                value={newContent.description}
                onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Enter tags separated by commas"
                value={newContent.tags}
                onChange={(e) => setNewContent({ ...newContent, tags: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Content</DialogTitle>
            <DialogDescription>
              Select platforms to share &quot;{selectedItem?.title}&quot;
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {socialPlatforms.map((platform) => (
              <div key={platform.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-secondary/50 transition-colors">
                <Checkbox
                  id={platform.id}
                  checked={selectedPlatforms.includes(platform.id)}
                  onCheckedChange={(checked: boolean) => {
                    if (checked) {
                      setSelectedPlatforms([...selectedPlatforms, platform.id]);
                    } else {
                      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.id));
                    }
                  }}
                />
                <Label
                  htmlFor={platform.id}
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                >
                  <platform.icon className={`h-5 w-5 ${platform.color}`} />
                  <span className="font-medium">{platform.name}</span>
                  {selectedItem?.sharedOn.includes(platform.id) && (
                    <Badge variant="secondary" className="ml-auto">Already shared</Badge>
                  )}
                </Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShareDialogOpen(false);
              setSelectedPlatforms([]);
            }}>
              Cancel
            </Button>
            <Button onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedItem?.title}</DialogTitle>
            <DialogDescription>
              Uploaded on {selectedItem?.uploadDate.toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedItem?.type === 'image' && selectedItem.url && (
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                <Image 
                  src={selectedItem.url} 
                  alt={selectedItem.title} 
                  fill
                  className="object-cover" 
                  unoptimized
                />
              </div>
            )}
            {selectedItem?.description && (
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
              </div>
            )}
            {selectedItem && selectedItem.tags.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
            {selectedItem && selectedItem.sharedOn.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Shared On</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.sharedOn.map((platformId) => {
                    const platform = socialPlatforms.find(p => p.id === platformId);
                    return platform ? (
                      <Badge key={platformId} variant="outline" className="flex items-center gap-1">
                        <platform.icon className={`h-3 w-3 ${platform.color}`} />
                        {platform.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setViewDialogOpen(false);
              setShareDialogOpen(true);
            }}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
