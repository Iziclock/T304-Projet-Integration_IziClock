CREATE TABLE Ringtones (
    ID UINT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Url VARCHAR(255) NOT NULL,
    IsDownloaded BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE Alarm (
    ID UINT PRIMARY KEY ,                        
    RingtoneID UINT DEFAULT 1,                           
    Name VARCHAR(255) NOT NULL,                
    RingDate DATETIME NOT NULL,                
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    PreparationTime UINT NOT NULL,
    LocationStart STRING NOT NULL,
    LocationEnd STRING NOT NULL,
    FOREIGN KEY (RingtoneID) REFERENCES Ringtones(ID) ON DELETE CASCADE
);