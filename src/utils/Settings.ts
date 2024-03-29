export interface Settings {
    ChunkSize: number;
    HeightLimit: number;
    BackgroundLimit: number;
    RenderDistance: number;
    DrawChunkBorders: boolean;
    DrawCollisionProcession: boolean;
    CollisionCheckIterations: number;
    MaxLights: number;
    MaxVolumetricColliders: number;
    MaxVolumetricEdges: number;
    VolumetricLights: boolean;
};

const Settings: Settings = {
    ChunkSize: 32,
    HeightLimit: 128,
    BackgroundLimit: 5,
    RenderDistance: 3,
    DrawChunkBorders: true,
    DrawCollisionProcession: false,
    CollisionCheckIterations: 40,
    MaxLights: 32,
    MaxVolumetricColliders: 16,
    MaxVolumetricEdges: 16,
    VolumetricLights: true
};

export default Settings;